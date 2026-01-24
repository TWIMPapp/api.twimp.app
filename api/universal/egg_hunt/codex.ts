import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from '../../_utils';
import { SessionService } from '../../../src/services/SessionService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    const { user_id } = req.query;
    const session = await SessionService.getUniversalSession(user_id as string, 'EGG_HUNT') as any;
    if (session) {
        res.json({ body: { ok: true, symbolUnlocks: session.symbolUnlocks } });
    } else {
        res.status(404).json({ ok: false, message: "No session found" });
    }
}
