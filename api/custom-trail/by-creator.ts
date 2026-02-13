import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from '../_utils';
import { CustomTrailService } from '../../src/services/CustomTrailService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    if (req.method !== 'GET') {
        return res.status(405).json({ ok: false, message: 'Method not allowed' });
    }

    const { creator_id } = req.query;
    const creatorId = Array.isArray(creator_id) ? creator_id[0] : creator_id;

    if (!creatorId) {
        return res.status(400).json({ ok: false, message: 'creator_id query parameter is required' });
    }

    const trails = await CustomTrailService.getTrailsByCreator(creatorId);

    const trailSummaries = trails.map(trail => ({
        id: trail.id,
        name: trail.name,
        theme: trail.theme,
        pinCount: trail.pins.length,
        mode: trail.mode,
        competitive: trail.competitive,
        playCount: trail.playCount,
        createdAt: trail.createdAt,
        expiresAt: trail.expiresAt,
        isActive: trail.isActive
    }));

    return res.json({
        body: {
            ok: true,
            trails: trailSummaries,
            totalTrails: trails.length
        }
    });
}
