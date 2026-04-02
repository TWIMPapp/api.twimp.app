import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from '../../_utils';
import { EasterEventService } from '../../../src/services/EasterEventService';

export default function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    const { id } = req.query;
    const chapterId = parseInt(id as string);
    const result = EasterEventService.getChapterContent(chapterId);
    res.json({ body: result });
}
