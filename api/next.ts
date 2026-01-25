import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from './_utils';
import { EasterEventService } from '../src/services/EasterEventService';
import { GameEngineService } from '../src/services/GameEngineService';
import { SessionService } from '../src/services/SessionService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, message: 'Method not allowed' });
    }

    const { game_ref, trail_ref, user_id, action, answer, puzzle_id, lat, lng } = req.body;
    const ref = game_ref || trail_ref; // Support both for backwards compatibility

    if (!ref || !user_id) {
        return res.status(400).json({ ok: false, message: "Missing game_ref or user_id" });
    }

    // Easter Event uses action-based routing
    if (ref === 'easter-event') {
        switch (action) {
            case 'collect':
                return res.json({ body: await EasterEventService.collectEgg(user_id, answer || '') });

            case 'puzzle':
                return res.json({ body: await EasterEventService.submitPuzzleAnswer(user_id, puzzle_id, answer) });

            case 'acknowledge':
                return res.json({ body: await EasterEventService.acknowledgeSafety(user_id) });

            case 'hazard':
                return res.json({ body: await EasterEventService.reportHazard(user_id) });

            case 'restart':
                await SessionService.clearUniversalSession(user_id, 'EASTER_EVENT');
                return res.json({ body: { ok: true, message: "Easter Event game restarted" } });

            case 'reset-spawn':
                if (!lat || !lng) {
                    return res.status(400).json({ ok: false, message: "lat and lng required for reset-spawn" });
                }
                return res.json({ body: await EasterEventService.resetSpawnLocation(user_id, parseFloat(lat), parseFloat(lng)) });

            default:
                return res.status(400).json({ ok: false, message: `Unknown action: ${action}` });
        }
    }

    // Trail games use GameEngine
    const result = await GameEngineService.handleNext(user_id, ref, answer);
    res.json({ body: result });
}
