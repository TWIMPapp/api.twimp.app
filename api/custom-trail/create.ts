import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from '../_utils';
import { CustomTrailService } from '../../src/services/CustomTrailService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, message: 'Method not allowed' });
    }

    const { creator_id, theme, name, start_location, pins, mode, competitive, count, has_questions, spawn_radius } = req.body;

    if (!creator_id) {
        return res.status(400).json({ ok: false, message: 'creator_id is required' });
    }
    if (!start_location || !start_location.lat || !start_location.lng) {
        return res.status(400).json({ ok: false, message: 'start_location with lat and lng is required' });
    }

    let finalPins = pins;

    if (mode === 'random') {
        if (!count || count < 1 || count > 20) {
            return res.status(400).json({ ok: false, message: 'count must be between 1 and 20 for random mode' });
        }
        const radius = (spawn_radius && spawn_radius >= 100 && spawn_radius <= 500)
            ? spawn_radius
            : 500;
        finalPins = CustomTrailService.generateRandomPins(
            start_location,
            count,
            !!has_questions,
            theme || 'general',
            radius
        );
    } else if (!pins || !Array.isArray(pins) || pins.length === 0) {
        return res.status(400).json({ ok: false, message: 'pins array is required for custom mode' });
    }

    const result = await CustomTrailService.createTrail(
        creator_id,
        theme || 'general',
        name,
        start_location,
        finalPins,
        mode || 'custom',
        !!competitive
    );

    if (!result.ok) {
        return res.status(400).json(result);
    }

    res.json({ body: result });
}
