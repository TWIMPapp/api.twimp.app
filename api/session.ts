import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from './_utils';
import { SessionService } from '../src/services/SessionService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    const { user_id, trail_ref } = req.query;
    const session = await SessionService.getSession(user_id as string, trail_ref as string);
    res.json({ body: { ok: true, session } });
}
