import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from '../../_utils';
import { EggHuntService } from '../../../src/services/EggHuntService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, message: 'Method not allowed' });
    }

    const { user_id, lat, lng } = req.body;
    const result = await EggHuntService.handleAWTY(user_id, parseFloat(lat), parseFloat(lng));
    res.json({ body: result });
}
