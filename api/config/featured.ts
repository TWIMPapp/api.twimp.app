import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from '../_utils';
import { GameConfigService } from '../../src/services/GameConfigService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);
    const featured = await GameConfigService.getFeatured();
    res.json({ body: { ok: true, featured } });
}
