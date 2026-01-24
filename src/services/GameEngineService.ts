import { GeoService } from './GeoService.js';
import { SessionService } from './SessionService.js';
import { TrailService } from './TrailService.js';
import { GameSession } from './SessionService.js';

export class GameEngineService {
    static async handleAWTY(userId: string, trailRef: string, lat: number, lng: number, accuracy: number = 10, currentTaskId?: number) {
        const session = await SessionService.getSession(userId, trailRef);
        const trail = TrailService.getResolvedTrail(trailRef);

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
            const proximityRadius = step.on_search?.proximity_radius || 20;

            const results = {
                index,
                distanceInMetres,
                inRange: distanceInMetres < (proximityRadius + (accuracy / 2)),
                // Port other conditions from legacy
                notBeenHereBefore: !session.path.split("|").includes(index.toString()) || (step.on_search?.can_revisit === true),
                isCurrentStep: index === currentStep,
                trackingEnabled: step.trackingEnabled !== false
            };

            const allowed = results.notBeenHereBefore && !results.isCurrentStep;

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
            const stepIndex = nearby[0].index;
            const pathArr = session.path ? session.path.split("|") : [];
            pathArr.push(stepIndex.toString());

            session.retries = 0;
            session.path = pathArr.join("|");
            session.task = stepIndex * 100;

            const items = this.updateItems(session, nearby[0]);
            // Also check tasks[0] of the step
            const taskItems = this.updateItems(session, nearby[0].tasks[0]);

            const task = { ...nearby[0].tasks[0] };

            // Cleanup task for frontend
            this.cleanupTaskForFrontend(task);

            await SessionService.saveSession(session);
            return { ok: true, task, outcome: { items: [...items, ...taskItems] } };
        }
    }

    static async handleNext(userId: string, trailRef: string, answer?: string) {
        const session = await SessionService.getSession(userId, trailRef);
        const trail = TrailService.getResolvedTrail(trailRef);

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
                        task = this.handleResponseActions(session, outcome.action, trail, task);
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
            if (task.on_arrival) {
                task = this.handleResponseActions(session, task.on_arrival, trail, task);
            }

            this.cleanupTaskForFrontend(task);
            session.task = stepIndex * 100 + taskIndex;
            await SessionService.saveSession(session);
        }

        return { ok, task, outcome: outcome || (task as any)?.outcome };
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

    private static handleResponseActions(session: GameSession, actions: string[], trail: any, task: any) {
        if (!actions) return task;

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
                            if (!task.outcome) task.outcome = { items: [] };
                            task.outcome.items.push({ sentiment: "positive", title: tItem.name, ...tItem });
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

        return task;
    }

    private static cleanupTaskForFrontend(task: any) {
        if (!task) return;
        delete task.on_arrival;
        delete task.on_search;
        delete task.on_answer;
        if (task.type === "question_single") {
            delete task.options;
        }
    }
}
