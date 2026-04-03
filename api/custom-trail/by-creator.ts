import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors, resolveCreatorFromApiKey } from '../_utils';
import { CustomTrailService } from '../../src/services/CustomTrailService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    if (req.method !== 'GET') {
        return res.status(405).json({ ok: false, message: 'Method not allowed' });
    }

    // Resolve creator_id: API key takes priority, then query param
    const authResult = await resolveCreatorFromApiKey(req);
    if (authResult && 'error' in authResult) {
        return res.status(401).json({ ok: false, message: authResult.error });
    }

    const { creator_id: query_creator_id } = req.query;
    const creatorId = authResult?.creator_id || (Array.isArray(query_creator_id) ? query_creator_id[0] : query_creator_id);

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
        settings: trail.settings,
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
