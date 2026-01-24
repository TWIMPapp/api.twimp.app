import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from '../_utils';
import { SessionService } from '../../src/services/SessionService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, message: 'Method not allowed' });
    }

    const { userId, lat, lng } = req.body;
    const session = await SessionService.getUniversalSession(userId, 'EGG_HUNT') as any;
    if (session) {
        session.startPosition = { lat, lng };
        session.safetyVerified = false;
        await SessionService.saveUniversalSession(session);
        res.json({ ok: true, message: "Spawn location updated", session });
    } else {
        res.status(404).json({ ok: false, message: "No session found" });
    }
}
