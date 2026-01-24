import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from '../_utils';
import { EasterEventService } from '../../src/services/EasterEventService';
import { SessionService } from '../../src/services/SessionService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    const { user_id, action, lat, lng } = req.body;

    if (action === 'restart') {
        await SessionService.clearUniversalSession(user_id, 'EASTER_EVENT');
        return res.json({ body: { ok: true, message: "Easter Event game restarted" } });
    }

    if (action === 'reset-spawn') {
        if (!lat || !lng) {
            return res.status(400).json({ ok: false, message: "lat and lng required for reset-spawn" });
        }
        const result = await EasterEventService.resetSpawnLocation(user_id, parseFloat(lat), parseFloat(lng));
        return res.json({ body: result });
    }

    res.status(400).json({ ok: false, message: "Invalid action. Use 'restart' or 'reset-spawn'" });
}
