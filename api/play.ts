import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from './_utils';
import { EasterEventService } from '../src/services/EasterEventService';
import { DinoHuntService } from '../src/services/DinoHuntService';
import { CustomTrailService } from '../src/services/CustomTrailService';
import { TrailService } from '../src/services/TrailService';
import { SessionService } from '../src/services/SessionService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, message: 'Method not allowed' });
    }

    const { game_ref, trail_ref, user_id, lat, lng } = req.body;
    const ref = game_ref || trail_ref; // Support both for backwards compatibility

    if (!ref || !user_id) {
        return res.status(400).json({ ok: false, message: "Missing game_ref or user_id" });
    }

    // Easter Event uses dedicated service
    if (ref === 'easter-event') {
        const result = await EasterEventService.startOrResumeGame(user_id, parseFloat(lat), parseFloat(lng));
        return res.json({ body: result });
    }

    // Dino Egg Hunt
    if (ref === 'dino-hunt') {
        const result = await DinoHuntService.startOrResumeGame(user_id, parseFloat(lat), parseFloat(lng));
        return res.json({ body: result });
    }

    // Custom Trail games
    if (ref.startsWith('custom-trail-')) {
        const trailId = ref.replace('custom-trail-', '');
        const result = await CustomTrailService.startPlay(user_id, trailId, parseFloat(lat), parseFloat(lng));
        return res.json({ body: result });
    }

    // Trail games
    const trail = TrailService.getResolvedTrail(ref);
    if (!trail) {
        return res.status(404).json({ ok: false, message: "Game not found" });
    }

    let session = await SessionService.getSession(user_id, ref);

    // If it's a completely new session (task -1), init it
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

    // Default MapTask
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
