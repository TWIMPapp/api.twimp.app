import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from '../_utils';
import { supabase } from '../../src/config/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    if (req.method !== 'POST') {
        return res.status(405).json({ body: { ok: false, error: 'Method not allowed' } });
    }

    const { town } = req.body || {};

    if (!town || typeof town !== 'string' || town.trim().length === 0) {
        return res.status(400).json({ body: { ok: false, error: 'Town is required' } });
    }

    const trimmed = town.trim().slice(0, 100);

    if (!supabase) {
        console.warn('[register-interest] Supabase not configured, skipping insert');
        return res.json({ body: { ok: true } });
    }

    try {
        await supabase.from('easter_interest').insert({
            town: trimmed,
            created_at: new Date().toISOString()
        });
    } catch (err) {
        console.error('[register-interest] Insert failed:', err);
    }

    res.json({ body: { ok: true } });
}
