import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from '../../_utils';
import { SessionService } from '../../../src/services/SessionService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, message: 'Method not allowed' });
    }

    const { user_id } = req.body;
    await SessionService.clearUniversalSession(user_id, 'EGG_HUNT');
    res.json({ ok: true, message: "Game restarted" });
}
