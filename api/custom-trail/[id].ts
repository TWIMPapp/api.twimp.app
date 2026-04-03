import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors, resolveCreatorFromApiKey } from '../_utils';
import { CustomTrailService } from '../../src/services/CustomTrailService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    const { id } = req.query;
    const trailId = Array.isArray(id) ? id[0] : id;

    if (!trailId) {
        return res.status(400).json({ ok: false, message: 'Trail ID is required' });
    }

    // Resolve API key if present (used by DELETE, PATCH, and creator GET)
    const authResult = await resolveCreatorFromApiKey(req);
    if (authResult && 'error' in authResult) {
        return res.status(401).json({ ok: false, message: authResult.error });
    }

    if (req.method === 'GET') {
        const { creator_id: query_creator_id } = req.query;
        const creator_id = authResult?.creator_id || (Array.isArray(query_creator_id) ? query_creator_id[0] : query_creator_id);

        // Creator view — returns full trail data + all player positions
        if (creator_id) {
            const result = await CustomTrailService.getCreatorView(trailId, creator_id as string);
            if (!result.ok) {
                return res.status(result.message === 'Trail not found' ? 404 : 403).json(result);
            }
            return res.json({ body: result });
        }

        // Player view — public trail info
        const trail = await CustomTrailService.getActiveTrail(trailId);
        if (!trail) {
            return res.status(404).json({ ok: false, message: 'Trail not found or has expired' });
        }

        return res.json({
            body: {
                ok: true,
                trail: {
                    id: trail.id,
                    theme: trail.theme,
                    name: trail.name,
                    startLocation: trail.startLocation,
                    pinCount: trail.pins.length || trail.dynamicConfig?.count || 0,
                    mode: trail.mode,
                    settings: trail.settings,
                    playCount: trail.playCount,
                    createdAt: trail.createdAt,
                    expiresAt: trail.expiresAt
                }
            }
        });
    }

    // Stop trail (soft-delete), ?expire=true to mark for immediate cleanup
    if (req.method === 'DELETE') {
        const { creator_id: body_creator_id } = req.body || {};
        const creator_id = authResult?.creator_id || body_creator_id;
        if (!creator_id) {
            return res.status(400).json({ ok: false, message: 'creator_id is required' });
        }
        const expire = req.query.expire === 'true';
        const result = await CustomTrailService.deleteTrail(creator_id, trailId, expire);
        return res.status(result.ok ? 200 : 403).json({ body: result });
    }

    // Reactivate trail
    if (req.method === 'PATCH') {
        const { creator_id: body_creator_id } = req.body || {};
        const creator_id = authResult?.creator_id || body_creator_id;
        if (!creator_id) {
            return res.status(400).json({ ok: false, message: 'creator_id is required' });
        }
        const result = await CustomTrailService.reactivateTrail(creator_id, trailId);
        return res.status(result.ok ? 200 : 400).json({ body: result });
    }

    return res.status(405).json({ ok: false, message: 'Method not allowed' });
}
