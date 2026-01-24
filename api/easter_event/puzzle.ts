import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from '../_utils';
import { EasterEventService } from '../../src/services/EasterEventService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    const { user_id, puzzle_id, answer } = req.body;
    const result = await EasterEventService.submitPuzzleAnswer(user_id, puzzle_id, answer);
    res.json({ body: result });
}
