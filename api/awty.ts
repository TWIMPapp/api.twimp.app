import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from './_utils';
import { EasterEventService } from '../src/services/EasterEventService';
import { DinoHuntService } from '../src/services/DinoHuntService';
import { CustomTrailService } from '../src/services/CustomTrailService';
import { GameEngineService } from '../src/services/GameEngineService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, message: 'Method not allowed' });
    }

    const { game_ref, trail_ref, user_id, lat, lng, accuracy, task_id } = req.body;
    const ref = game_ref || trail_ref; // Support both for backwards compatibility

    if (!ref || !user_id) {
        return res.status(400).json({ ok: false, message: "Missing game_ref or user_id" });
    }

    // Easter Event uses dedicated service
    if (ref === 'easter-event') {
        const result = await EasterEventService.handleAWTY(user_id, parseFloat(lat), parseFloat(lng));
        return res.json({ body: result });
    }

    // Dino Egg Hunt
    if (ref === 'dino-hunt') {
        const result = await DinoHuntService.handleAWTY(user_id, parseFloat(lat), parseFloat(lng));
        return res.json({ body: result });
    }

    // Custom Trail games
    if (ref.startsWith('custom-trail-')) {
        const trailId = ref.replace('custom-trail-', '');
        const result = await CustomTrailService.handleAWTY(user_id, trailId, parseFloat(lat), parseFloat(lng));
        return res.json({ body: result });
    }

    // Trail games use GameEngine
    const result = await GameEngineService.handleAWTY(
        user_id,
        ref,
        parseFloat(lat),
        parseFloat(lng),
        parseFloat(accuracy),
        task_id
    );
    res.json({ body: result });
}
