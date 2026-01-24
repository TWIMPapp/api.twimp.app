import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from './_utils';
import { GameEngineService } from '../src/services/GameEngineService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, message: 'Method not allowed' });
    }

    const { user_id, trail_ref, lat, lng, accuracy, task_id } = req.body;
    const result = await GameEngineService.handleAWTY(
        user_id,
        trail_ref,
        parseFloat(lat),
        parseFloat(lng),
        parseFloat(accuracy),
        task_id
    );
    res.json({ body: result });
}
