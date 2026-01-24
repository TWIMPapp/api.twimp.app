import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from './_utils';
import { TrailService } from '../src/services/TrailService';
import { SessionService } from '../src/services/SessionService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, message: 'Method not allowed' });
    }

    const { trail_ref, user_id } = req.body;
    if (!trail_ref || !user_id) {
        return res.status(400).json({ ok: false, message: "Missing params" });
    }

    const trail = TrailService.getResolvedTrail(trail_ref);
    if (!trail) {
        return res.status(404).json({ ok: false, message: "Trail not found" });
    }

    let session = await SessionService.getSession(user_id, trail_ref);

    if (session.task === -1) {
        session.playStart = Date.now();
        await SessionService.saveSession(session);
    }

    if (session.task >= 0) {
        const stepIndex = Math.floor(session.task / 100);
        const taskIndex = session.task % 100;
        const step = (trail as any).steps[stepIndex];
        const task = step ? step.tasks[taskIndex] : null;
        if (task) {
            return res.json({ body: { ok: true, task } });
        }
    }

    const visibleSteps = (trail as any).steps.filter((s: any) => !s.hidden && s.location && s.location.lat);
    const mapTask = {
        id: -1,
        type: 'map',
        content: trail.description || (trail.steps[0]?.name + " - Go here!"),
        required: false,
        markers: visibleSteps.map((s: any) => ({
            lat: s.location.lat,
            lng: s.location.lng,
            title: s.name,
            subtitle: "Go here",
            colour: 'red',
            status: 'active'
        }))
    };

    res.json({ body: { ok: true, task: mapTask } });
}
