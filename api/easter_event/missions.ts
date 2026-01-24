import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from '../_utils';
import { EasterEventService } from '../../src/services/EasterEventService';

export default function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    const result = EasterEventService.getMissionUpdates();
    res.json({ body: result });
}
