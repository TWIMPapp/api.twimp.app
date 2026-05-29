import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from '../_utils';
import { MagicLinkService } from '../../src/services/MagicLinkService';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, message: 'Method not allowed' });
    }

    const { email } = req.body || {};
    if (!email || typeof email !== 'string' || !EMAIL_RE.test(email)) {
        return res.status(400).json({ ok: false, message: 'A valid email is required' });
    }

    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket?.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const result = await MagicLinkService.createAndSend(email, ip, userAgent as string | undefined);
    if (!result.ok) {
        return res.status(500).json({ ok: false, message: result.message || 'Failed to send sign-in email' });
    }

    // Always respond ok — don't leak whether the email already has an account.
    return res.json({ ok: true, message: 'Check your email for a sign-in link.' });
}
