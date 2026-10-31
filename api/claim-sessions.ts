import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { handleOptions, cors } from './_utils';
import { claimSessions } from '../src/services/ClaimSessionsService';

// Server-to-server only. The game's Next.js /api/claim-sessions verifies the
// player's NextAuth session, then calls this with the verified email and the
// shared CLAIM_SESSIONS_SECRET. Browsers cannot call this directly.
function secretOk(req: VercelRequest): boolean {
    const expected = process.env.CLAIM_SESSIONS_SECRET;
    const given = req.headers['x-twimp-internal-secret'];
    if (!expected || typeof given !== 'string') return false;
    const a = Buffer.from(expected);
    const b = Buffer.from(given);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);
    if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });
    if (!secretOk(req)) return res.status(401).json({ ok: false, error: 'Unauthorised' });

    const { email, anon_id, dry_run } = req.body || {};
    const result = await claimSessions(email, anon_id, { dryRun: dry_run === true });
    if (!result.ok) return res.status(result.status).json({ ok: false, error: result.error });
    console.log('[claim-sessions]', JSON.stringify({ target: result.target_user_id, claimed: result.claimed, skipped: result.skipped_conflicts, dry_run: !!dry_run }));
    return res.json(result);
}
