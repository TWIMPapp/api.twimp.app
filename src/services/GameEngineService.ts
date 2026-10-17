import { GeoService } from './GeoService';
import { SessionService } from './SessionService';
import { TrailService } from './TrailService';
import { GameSession } from './SessionService';
import { resolveDateTokens, resolvePlayerVisible } from '../utils/dateTokens';

export class GameEngineService {
    static async handleAWTY(userId: string, trailRef: string, lat: number, lng: number, accuracy: number = 10, currentTaskId?: number, batch: boolean = false) {
        const session = await SessionService.getSession(userId, trailRef);
        const trail = await TrailService.getResolvedTrailAsync(trailRef) || TrailService.getResolvedTrail(trailRef);

        if (!trail) {
            return { ok: false, reason: "Trail not found" };
        }

        // Rate limiting
        if (session.lastAWTY) {
            const secondsElapsed = (Date.now() - session.lastAWTY) / 1000;
            if (secondsElapsed < 5) {
                return { ok: false, reason: "Too many requests" };
            }
        }

        if (accuracy > 75) {
            return { ok: false, reason: "GPS accuracy too low" };
        }

        session.lastAWTY = Date.now();

        const currentStep = Math.floor(session.task / 100);

        // Sets used by requiredSteps / requiredItems below — built once for the
        // whole sweep rather than per-step.
        const visitedSteps = new Set(
            (session.path ? session.path.split('|') : []).filter(Boolean).map(s => parseInt(s, 10))
        );
        const heldItems = new Set(
            (session.items || []).map((it: any) => typeof it === 'string' ? it : it?.key).filter(Boolean)
        );

        // Calculate proximity and allowed steps
        const steps = (trail as any).steps.map((step: any, index: number) => {
            const distanceInMetres = GeoService.getDistanceFromLatLonInMeters(lat, lng, step.location.lat, step.location.lng);
            // Catchment = object_size + accuracy_buffer
            //   accuracy_buffer = 1.5 * accuracy, clamped to [10, 40]
            //   object_size     = on_search.proximity_radius ?? 1
            //
            // Examples:
            //   normal pin (prox=1),   acc=1  → 1  + 10 = 11m
            //   normal pin (prox=1),   acc=30 → 1  + 40 = 41m
            //   building (prox=50),    acc=1  → 50 + 10 = 60m (perimeter of 50m-wide)
            //   building (prox=50),    acc=30 → 50 + 40 = 90m
            //   stadium (prox=200),    acc=5  → 200 + 10 = 210m
            const proximityRadius = step.on_search?.proximity_radius ?? 1;
            const accuracyBuffer = Math.min(40, Math.max(10, accuracy * 1.5));
            const catchmentRadius = proximityRadius + accuracyBuffer;

            const results = {
                index,
                distanceInMetres,
                inRange: distanceInMetres < catchmentRadius,
                // Port other conditions from legacy
                notBeenHereBefore: !session.path.split("|").includes(index.toString()) || (step.on_search?.can_revisit === true),
                isCurrentStep: index === currentStep,
                trackingEnabled: step.trackingEnabled !== false
            };

            // A step with a state requirement is only allowed if the session state matches.
            // step.state may be a string (single gate) or an array (any-match).
            const stateRequired = step.state
                ? (Array.isArray(step.state) ? step.state.includes(session.state) : session.state === step.state)
                : true;
            // step.requiredSteps: every listed step index must already be in
            // session.path. ANDed with state. Unset = no prerequisite.
            const requiredStepsMet = Array.isArray(step.requiredSteps)
                ? step.requiredSteps.every((i: number) => visitedSteps.has(i))
                : true;
            // step.requiredItems: every listed item key must be in session.items.
            const requiredItemsMet = Array.isArray(step.requiredItems)
                ? step.requiredItems.every((k: string) => heldItems.has(k))
                : true;
            const allowed = results.notBeenHereBefore && !results.isCurrentStep
                && stateRequired && requiredStepsMet && requiredItemsMet;

            return { ...step, ...results, allowed };
        }).sort((a: any, b: any) => a.distanceInMetres - b.distanceInMetres);

        const nearby = steps.filter((s: any) => s.allowed && s.inRange);

        if (nearby.length === 0) {
            const closest = steps.filter((s: any) => s.allowed)[0];
            let message = "Not close enough";
            let direction, distance;

            if (closest) {
                const b = GeoService.bearing(lat, lng, closest.location.lat, closest.location.lng);
                direction = GeoService.degToCompass(b);
                distance = Math.floor(closest.distanceInMetres);

                if (closest.trackingEnabled) {
                    message = `Head ${direction} for ${distance} metres`;
                }
            }

            await SessionService.saveSession(session);
            return { ok: true, message, distance, direction };
        } else {
            // Step activated
            const step = nearby[0];
            const stepIndex = step.index;
            const pathArr = session.path ? session.path.split("|") : [];
            pathArr.push(stepIndex.toString());

            session.retries = 0;
            session.path = pathArr.join("|");
            session.task = stepIndex * 100;

            // step.on_arrival supports three schemas:
            //   - { items_added, items_removed }  → legacy items, handled by updateItems
            //   - ["setState -value TOM", ...]    → unconditional actions
            //   - { TOM: ["setState ..."], ... }  → conditional by entry state. Entry state
            //                                       is read BEFORE any setState in the actions
            //                                       fires (otherwise the lookup races itself).
            const items = this.updateItems(session, step);
            const taskItems = this.updateItems(session, step.tasks[0]);
            const entryState = session.state;
            const resolvedActions = this.resolveConditionalActions(step.on_arrival, entryState);
            const stepArrivalItems = resolvedActions ? this.applyActions(session, resolvedActions, trail).items : [];

            const task = this.cleanupTaskForFrontend(step.tasks[0], session.state);
            const batchFields = batch ? this.buildBatch(session, trail, stepIndex, 0) : {};

            await SessionService.saveSession(session);
            // Resolve on the response copy. `task` is already a shallow clone from
            // cleanup; items are new objects. The cached trail is not written.
            return resolvePlayerVisible(
                { ok: true, step_type: step.type, task, outcome: { items: [...items, ...taskItems, ...stepArrivalItems] }, ...batchFields },
                session.playStart,
            );
        }
    }

    static async handleNext(userId: string, trailRef: string, answer?: string, opts: { batch?: boolean; syncPosition?: number } = {}) {
        const session = await SessionService.getSession(userId, trailRef);
        const trail = await TrailService.getResolvedTrailAsync(trailRef) || TrailService.getResolvedTrail(trailRef);

        if (!trail) return { ok: false, message: "Trail not found" };

        // Background cross-check from a batch client (see buildBatch). Read-only:
        // no advance, no side effects — returns the card at `syncPosition`
        // exactly as it was cleaned when the batch was sent.
        if (typeof opts.syncPosition === 'number' && !Number.isNaN(opts.syncPosition)) {
            return this.handleSync(session, trail, opts.syncPosition);
        }

        if (session.task === 0) {
            session.playStart = Date.now();
        }

        let stepIndex = Math.floor(session.task / 100);
        let taskIndex = session.task % 100;

        const step = (trail as any).steps[stepIndex];
        let task = step.tasks[taskIndex];

        if (!task) return { ok: false, reason: "Invalid session task" };

        let ok = false;
        let outcome: any = undefined;

        if (task.type === "information") {
            ok = true;
            taskIndex++;
            task = step.tasks[taskIndex];
        } else if (task.type === "question_single" || task.type === "question_multiple") {
            ok = true;
            if (task.session_key && answer) {
                session.input[task.session_key] = answer.trim();
            }

            // Handle branching or correct answer
            const hasOptions = Array.isArray(task.options) && task.options.length > 0;
            if (hasOptions && !answer) {
                // A question with options requires a valid answer. Without one we
                // must NOT advance — otherwise an answerless /next (e.g. fired by
                // a stuck "Next" button after a back-navigation) skips the
                // question as if it were answered correctly.
                ok = false;
                task = undefined;
            } else if (hasOptions && answer) {
                // An option's `content` may be a single accepted answer (string)
                // or several equivalent ones (string[]), e.g. ["1956", "56"].
                const ans = answer.trim().toLowerCase();
                const match = task.options.find((o: any) =>
                    (Array.isArray(o.content) ? o.content : [o.content]).some((c: any) => {
                        const raw = String(c ?? '');
                        // The client submits the text the player saw. Date tokens
                        // are resolved for that comparison only — `o` stays the
                        // cached trail option.
                        const shown = raw.includes('{{') ? resolveDateTokens(raw, session.playStart) : raw;
                        return shown.toLowerCase() === ans;
                    })
                );
                if (match) {
                    if (match.response?.sentiment === "positive") {
                        taskIndex++;
                    }
                    // Copy before attaching granted items. `match.response` is a
                    // reference into the cached trail.
                    outcome = match.response ? { ...match.response } : undefined;
                    if (outcome?.action) {
                        const r = this.applyActions(session, outcome.action, trail);
                        if (r.items.length) outcome.items = [...(outcome.items || []), ...r.items];
                    }
                    task = step.tasks[taskIndex];
                } else {
                    outcome = { sentiment: "negative", title: "Incorrect" };
                    task = undefined; // Stay on same task
                }
            } else {
                // Free-text question (no options): store input (above) and advance.
                taskIndex++;
                task = step.tasks[taskIndex];
            }
        }

        if (task) {
            const taskActions = this.resolveConditionalActions(task.on_arrival, session.state);
            if (taskActions) {
                const r = this.applyActions(session, taskActions, trail);
                if (r.items.length) {
                    outcome = outcome || { items: [] };
                    outcome.items = [...(outcome.items || []), ...r.items];
                }
            }

            task = this.cleanupTaskForFrontend(task, session.state);
            session.task = stepIndex * 100 + taskIndex;
            const batchFields = opts.batch ? this.buildBatch(session, trail, stepIndex, taskIndex) : {};
            await SessionService.saveSession(session);
            return resolvePlayerVisible({ ok, task, outcome, ...batchFields }, session.playStart);
        }

        return resolvePlayerVisible({ ok, task, outcome }, session.playStart);
    }

    static async handleRestart(userId: string, trailRef: string) {
        const session = SessionService.createDefaultSession(userId, trailRef);
        session.playStart = Date.now();
        await SessionService.saveSession(session);

        return { ok: true, message: "Game restarted" };
    }

    private static updateItems(session: GameSession, stepOrTask: any): any[] {
        if (!stepOrTask.on_arrival) return [];

        const items: any[] = [];
        const added = stepOrTask.on_arrival.items_added || [];
        const removed = stepOrTask.on_arrival.items_removed || [];

        if (added.length) {
            session.items.push(...added);
            items.push(...added.map((x: any) => ({ ...x, sentiment: "positive" })));
        }

        if (removed.length) {
            const toRemove = new Set(removed);
            session.items = session.items.filter((x: any) => !toRemove.has(x));
            items.push(...removed.map((x: any) => ({ ...x, sentiment: "negative" })));
        }

        return items;
    }

    // Applies an array of action strings (e.g. "setState -value TOM",
    // "addItem -item map", "addScore -value 5") to the session. Returns an
    // outcome { items } suitable for merging into the response payload.
    //
    // MUST NOT mutate the source trail. Previously the addItem branch wrote
    // to task.outcome on the source task, which on warm serverless instances
    // caused outcomes to accumulate across requests.
    private static applyActions(session: GameSession, actions: any, trail: any): { items: any[] } {
        const outcome: { items: any[] } = { items: [] };
        if (!Array.isArray(actions)) return outcome;

        for (const action of actions) {
            const [cmd, ...params] = action.split(' ');
            const pMap: Record<string, string> = {};
            for (let i = 0; i < params.length; i += 2) {
                if (params[i] && params[i + 1]) {
                    pMap[params[i].replace('-', '')] = params[i + 1];
                }
            }

            switch (cmd) {
                case 'setState':
                    if (pMap.input && session.input[pMap.input]) {
                        session.state = session.input[pMap.input];
                    } else if (pMap.value) {
                        session.state = pMap.value;
                    }
                    break;
                case 'addItem':
                    if (pMap.item) {
                        session.items.push(pMap.item);
                        const tItem = trail.items?.find((x: any) => x.key === pMap.item);
                        if (tItem) {
                            outcome.items.push({ sentiment: "positive", title: tItem.name, ...tItem });
                        }
                    }
                    break;
                case 'addScore':
                    if (pMap.value) {
                        session.score = (session.score || 0) + parseFloat(pMap.value);
                    }
                    break;
            }
        }

        return outcome;
    }

    // Returns a shallow clone with frontend-only fields stripped + conditional
    // markers resolved against session.state. MUST NOT mutate the input — `task`
    // is a reference into the module-cached trail data, and mutating it
    // permanently corrupts the trail for every subsequent request on the warm
    // serverless instance (on_arrival/options would disappear after the first
    // user hit that task, breaking state transitions and question answers).
    private static cleanupTaskForFrontend(task: any, sessionState: string = '') {
        if (!task) return task;
        const clean = { ...task };
        delete clean.on_arrival;
        delete clean.on_search;
        delete clean.on_answer;
        if (clean.type === "question_single") {
            delete clean.options;
        }
        // Map task markers may be state-keyed: { STATE_NAME: [...locationIds] }.
        // Resolve to a plain array of the markers visible in the current state.
        if (clean.type === "map" && clean.markers && !Array.isArray(clean.markers) && typeof clean.markers === 'object') {
            clean.markers = clean.markers[sessionState] || [];
        }
        return clean;
    }

    // ===== Batch next =====
    //
    // With `batch: true` the response carries, alongside the unchanged `task`:
    //   position: number        — session position of `task` (step*100 + index)
    //   upcoming: UpcomingTask[] — the cards after `task` in the same step, up to
    //                              and including the next blocking card (anything
    //                              that is not an `information` card: questions,
    //                              map, finish, other interactive types) or the
    //                              end of the step. Empty when `task` is blocking.
    // Each upcoming entry is the cleaned card plus:
    //   position, server_call_required (source card had on_arrival), items
    //   (items its on_arrival granted).
    //
    // Session advance: on_arrival for every card in the batch is applied now
    // (accepted trade-off), and session.task is moved to the LAST card in the
    // batch. That way a later answer / swipe-past-end /next acts on the right
    // card, and on_arrival is never applied twice. The state each card was
    // cleaned with is remembered (session.input[BATCH_KEY]) so a client's
    // background `sync_position` call can return a byte-identical card for
    // cross-checking without touching the session.
    static readonly BATCH_KEY = '__batch';

    private static isBlocking(task: any): boolean {
        return !task || task.type !== 'information';
    }

    private static buildBatch(session: GameSession, trail: any, stepIndex: number, taskIndex: number) {
        const step = trail.steps[stepIndex];
        const position = stepIndex * 100 + taskIndex;
        const states: Record<string, string> = { [position]: session.state || '' };
        const upcoming: any[] = [];

        if (!this.isBlocking(step.tasks[taskIndex])) {
            for (let i = taskIndex + 1; i < step.tasks.length; i++) {
                const src = step.tasks[i];
                const actions = this.resolveConditionalActions(src.on_arrival, session.state);
                const items = actions ? this.applyActions(session, actions, trail).items : [];
                const pos = stepIndex * 100 + i;
                states[pos] = session.state || '';
                upcoming.push({
                    ...this.cleanupTaskForFrontend(src, session.state),
                    position: pos,
                    server_call_required: !!src.on_arrival,
                    items,
                });
                session.task = pos;
                if (this.isBlocking(src)) break;
            }
        }

        session.input = session.input || {};
        session.input[this.BATCH_KEY] = JSON.stringify({ from: position, to: session.task, states });
        return { position, upcoming };
    }

    private static handleSync(session: GameSession, trail: any, position: number) {
        let batch: any = null;
        try { batch = JSON.parse(session.input?.[this.BATCH_KEY] || 'null'); } catch { batch = null; }
        const inBatch = batch && batch.states && Object.prototype.hasOwnProperty.call(batch.states, String(position))
            && position >= batch.from && position <= batch.to && batch.to === session.task;
        if (!inBatch) {
            return { ok: false, synced: false, reason: 'Position not in current batch', position: session.task };
        }
        const src = trail.steps[Math.floor(position / 100)]?.tasks[position % 100];
        if (!src) return { ok: false, synced: false, reason: 'Invalid position', position: session.task };
        const task = this.cleanupTaskForFrontend(src, batch.states[String(position)]);
        return resolvePlayerVisible({ ok: true, synced: true, position, task }, session.playStart);
    }

    // step.on_arrival / task.on_arrival can be:
    //   - undefined / null                       → no actions
    //   - { items_added, items_removed }         → legacy items form, handled by updateItems
    //   - ["setState ...", ...]                  → unconditional action array
    //   - { STATE_NAME: ["setState ..."], ... }  → conditional by entry state
    // This returns the resolved action array (or null) for the given state.
    private static resolveConditionalActions(onArrival: any, sessionState: string): string[] | null {
        if (!onArrival) return null;
        if (Array.isArray(onArrival)) return onArrival;
        if (typeof onArrival === 'object') {
            // Legacy items form has its own keys — leave it for updateItems
            if ('items_added' in onArrival || 'items_removed' in onArrival) return null;
            const branch = onArrival[sessionState];
            return Array.isArray(branch) ? branch : null;
        }
        return null;
    }
}
