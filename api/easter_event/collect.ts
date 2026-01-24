import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from '../_utils';
import { EasterEventService } from '../../src/services/EasterEventService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, message: 'Method not allowed' });
    }

    const { user_id, answer } = req.body;
    const result = await EasterEventService.collectEgg(user_id, answer);
    res.json({ body: result });
}
