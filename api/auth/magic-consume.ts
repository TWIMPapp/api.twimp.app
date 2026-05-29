import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from '../_utils';
import { MagicLinkService } from '../../src/services/MagicLinkService';

// Called server-side by the frontend's NextAuth Credentials provider. Burns the
// one-time token and returns the email it was issued for; NextAuth then mints
// the session.
export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, message: 'Method not allowed' });
    }

    const { token } = req.body || {};
    if (!token || typeof token !== 'string') {
        return res.status(400).json({ ok: false, message: 'Token required' });
    }

    const email = await MagicLinkService.consume(token);
    if (!email) {
        return res.status(400).json({ ok: false, message: 'This sign-in link is invalid or has expired' });
    }

    return res.json({ ok: true, email });
}
