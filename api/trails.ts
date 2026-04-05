import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors, resolveCreatorFromApiKey } from './_utils';
import { TrailService } from '../src/services/TrailService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    if (req.method === 'POST') {
        const authResult = await resolveCreatorFromApiKey(req);

        if (!authResult) {
            return res.status(401).json({ ok: false, message: 'API key required' });
        }
        if ('error' in authResult) {
            return res.status(403).json({ ok: false, message: authResult.error });
        }

        const { trail, source } = req.body;

        if (!trail || !trail.ref || !trail.steps) {
            return res.status(400).json({ ok: false, message: 'trail with ref and steps required' });
        }

        const result = await TrailService.saveTrail(trail, authResult.creator_id, source || 'dynamic');

        if (!result.ok) {
            return res.status(500).json(result);
        }

        return res.json({ ok: true, ref: trail.ref });
    }

    return res.status(405).json({ ok: false, message: 'Method not allowed' });
}
