import { GeoService } from './GeoService';
import { SessionService } from './SessionService';
import { TrailService } from './TrailService';
import { GameSession } from './SessionService';

export class GameEngineService {
    static async handleAWTY(userId: string, trailRef: string, lat: number, lng: number, accuracy: number = 10, currentTaskId?: number) {
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
            const allowed = results.notBeenHereBefore && !results.isCurrentStep && stateRequired;

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
                    message = `You need to head ${direction} for ${distance} metres`;
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

            await SessionService.saveSession(session);
            return { ok: true, step_type: step.type, task, outcome: { items: [...items, ...taskItems, ...stepArrivalItems] } };
        }
    }

    static async handleNext(userId: string, trailRef: string, answer?: string) {
        const session = await SessionService.getSession(userId, trailRef);
        const trail = await TrailService.getResolvedTrailAsync(trailRef) || TrailService.getResolvedTrail(trailRef);

        if (!trail) return { ok: false, message: "Trail not found" };

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
            if (task.options && answer) {
                const match = task.options.find((o: any) => o.content.toLowerCase() === answer.trim().toLowerCase());
                if (match) {
                    if (match.response?.sentiment === "positive") {
                        taskIndex++;
                    }
                    outcome = match.response;
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
            await SessionService.saveSession(session);
        }

        return { ok, task, outcome };
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
