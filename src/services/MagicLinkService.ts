import crypto from 'crypto';
import { Resend } from 'resend';
import { supabaseAdmin } from '../config/supabase';

// Passwordless email sign-in. Mirrors the Go Bucks magic-link flow (single-use,
// short-lived tokens in a DB table) but the *session* is minted by NextAuth on
// the frontend via a Credentials provider — this service only issues and
// consumes the one-time token.

const MAGIC_LINK_TTL_MS = 15 * 60 * 1000; // 15 minutes
const GAME_URL = process.env.GAME_URL || 'https://game.twimp.app';

let _resend: Resend | null = null;
function resend(): Resend {
    if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
    return _resend;
}

export class MagicLinkService {
    /** Create a one-time token, store it, and email the sign-in link. */
    static async createAndSend(
        email: string,
        ip?: string,
        userAgent?: string
    ): Promise<{ ok: boolean; message?: string }> {
        if (!supabaseAdmin) return { ok: false, message: 'Sign-in is not configured' };

        const normalised = email.toLowerCase().trim();
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + MAGIC_LINK_TTL_MS).toISOString();

        const { error } = await supabaseAdmin.from('magic_links').insert({
            token,
            email: normalised,
            expires_at: expiresAt,
            ip: ip || null,
            user_agent: userAgent || null,
        });
        if (error) {
            console.error('[magic-link] insert error', error);
            return { ok: false, message: 'Could not create a sign-in link' };
        }

        const url = `${GAME_URL}/auth/magic?token=${token}`;
        return this.sendEmail(normalised, url);
    }

    /** Validate and burn a token (single-use). Returns the email it was issued for, or null. */
    static async consume(token: string): Promise<string | null> {
        if (!supabaseAdmin || !token) return null;

        const { data, error } = await supabaseAdmin
            .from('magic_links')
            .select('email, expires_at, used_at')
            .eq('token', token)
            .maybeSingle();

        if (error || !data) return null;
        if (data.used_at) return null;
        if (new Date(data.expires_at as string).getTime() < Date.now()) return null;

        // Mark used — the `is('used_at', null)` guard makes this safe against a
        // double-consume race (only the first update matches).
        const { error: updErr } = await supabaseAdmin
            .from('magic_links')
            .update({ used_at: new Date().toISOString() })
            .eq('token', token)
            .is('used_at', null);

        if (updErr) {
            console.error('[magic-link] consume update error', updErr);
            return null;
        }

        return data.email as string;
    }

    private static async sendEmail(
        toEmail: string,
        url: string
    ): Promise<{ ok: boolean; message?: string }> {
        if (!process.env.RESEND_API_KEY) {
            console.warn('[magic-link] RESEND_API_KEY not set — link not emailed');
            console.log(`[magic-link] DEV LINK for ${toEmail}: ${url}`);
            return { ok: true };
        }

        const text = `Tap the link below to sign in to Twimp:\n\n${url}\n\nThis link expires in 15 minutes and can only be used once.\n\nIf you didn't request this, you can safely ignore it.`;
        const html = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a;">
              <h1 style="color: #FF2E5B; margin: 0 0 16px 0;">Sign in to Twimp</h1>
              <p style="color: #555; line-height: 1.6;">Tap the button below to sign in. The link expires in 15 minutes.</p>
              <a href="${url}" style="display: inline-block; background: #FF2E5B; color: #ffffff; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 999px; margin: 16px 0;">Sign in</a>
              <p style="color: #888; font-size: 13px; margin-top: 32px;">If the button doesn't work, paste this into your browser:<br><a href="${url}" style="color: #FF2E5B; word-break: break-all;">${url}</a></p>
              <p style="color: #888; font-size: 13px; margin-top: 24px;">If you didn't request this email, you can safely ignore it.</p>
            </div>
        `;

        try {
            const { error } = await resend().emails.send({
                from: 'Twimp <hello@twimp.app>',
                to: toEmail,
                subject: 'Your Twimp sign-in link',
                text,
                html,
            });
            if (error) {
                console.error('[magic-link] Resend error', error);
                return { ok: false, message: 'Failed to send sign-in email' };
            }
            return { ok: true };
        } catch (e) {
            console.error('[magic-link] sendEmail error', e);
            return { ok: false, message: 'Failed to send sign-in email' };
        }
    }
}
