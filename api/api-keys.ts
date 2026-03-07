import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from './_utils';
import { ApiKeyService } from '../src/services/ApiKeyService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    // All operations require admin secret
    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret) {
        return res.status(500).json({ ok: false, message: 'Admin secret not configured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${adminSecret}`) {
        return res.status(401).json({ ok: false, message: 'Unauthorized' });
    }

    if (req.method === 'POST') {
        const { creator_id, name } = req.body;
        if (!creator_id) {
            return res.status(400).json({ ok: false, message: 'creator_id is required' });
        }

        const result = await ApiKeyService.createKey(creator_id, name);
        return res.status(result.ok ? 200 : 500).json({ body: result });
    }

    return res.status(405).json({ ok: false, message: 'Method not allowed' });
}
