import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from '../_utils';
import { EasterEventService } from '../../src/services/EasterEventService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    const { user_id } = req.query;
    const result = await EasterEventService.getSpawnRadius(user_id as string);
    res.json({ body: result });
}
