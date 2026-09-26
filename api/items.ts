import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from './_utils';
import { SessionService } from '../src/services/SessionService';
import { TrailService } from '../src/services/TrailService';
import { resolvePlayerVisible } from '../src/utils/dateTokens';

// Player inventory. The client reads title / subtitle (and falls back to the
// artwork). Held entries are item keys from addItem, or legacy item objects
// from items_added. Names are copied off the trail catalogue and date tokens
// are resolved on that copy.

function presentHeldItem(held: any, catalog: any[]): any | null {
    if (typeof held === 'string') {
        const def = catalog.find((item) => item?.key === held);
        if (!def) return { key: held, name: held, title: held };
        return { ...def, sentiment: 'positive', title: def.title ?? def.name };
    }
    if (held && typeof held === 'object') {
        const def = held.key ? catalog.find((item) => item?.key === held.key) : undefined;
        const merged = { ...(def || {}), ...held, sentiment: held.sentiment || 'positive' };
        if (merged.title == null && merged.name != null) merged.title = merged.name;
        return merged;
    }
    return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    if (req.method !== 'GET') {
        return res.status(405).json({ ok: false, message: 'Method not allowed' });
    }

    const ref = (req.query.trail_ref || req.query.game_ref) as string | undefined;
    const userId = req.query.user_id as string | undefined;
    if (!ref || !userId) {
        return res.status(400).json({ ok: false, message: 'Missing game_ref or user_id' });
    }

    const session = await SessionService.getSession(userId, ref);
    const trail = await TrailService.getResolvedTrailAsync(ref) || TrailService.getResolvedTrail(ref);
    if (!trail) {
        return res.status(404).json({ ok: false, message: 'Game not found' });
    }

    const catalog = (trail as any).items || [];
    const items = (session.items || [])
        .map((held: any) => presentHeldItem(held, catalog))
        .filter(Boolean);

    res.json({ ok: true, items: resolvePlayerVisible(items, session.playStart) });
}