import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { handleOptions } from './_utils';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /subscribe { email }
 *
 * Newsletter signup for the twimp.app marketing page. Writes into the
 * existing `users` table:
 *   - new email → INSERT with provider='newsletter' and newsletter_subscribed_at=NOW()
 *   - existing email → UPDATE newsletter_subscribed_at if NULL (idempotent re-subscribe)
 *
 * Single source of truth for emails: an OAuth user can later become a
 * newsletter subscriber too, and a newsletter subscriber can later upgrade
 * to a full account without us juggling two tables.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  if (!supabase) {
    return res.status(503).json({ ok: false, message: 'Database not configured' });
  }

  const rawEmail = (req.body?.email ?? '').toString().trim().toLowerCase();
  if (!rawEmail || !EMAIL_REGEX.test(rawEmail)) {
    return res.status(400).json({ ok: false, message: 'Valid email required' });
  }

  try {
    const { data: existing, error: lookupErr } = await supabase
      .from('users')
      .select('id, email, provider, newsletter_subscribed_at')
      .eq('email', rawEmail)
      .maybeSingle();

    if (lookupErr) {
      console.error('[subscribe] lookup failed', lookupErr);
      return res.status(500).json({ ok: false, message: 'Lookup failed' });
    }

    if (existing) {
      if (existing.newsletter_subscribed_at) {
        return res.status(200).json({ ok: true, alreadySubscribed: true });
      }
      const { error: updateErr } = await supabase
        .from('users')
        .update({ newsletter_subscribed_at: new Date().toISOString() })
        .eq('id', existing.id);
      if (updateErr) {
        console.error('[subscribe] update failed', updateErr);
        return res.status(500).json({ ok: false, message: 'Subscribe failed' });
      }
      return res.status(200).json({ ok: true, alreadySubscribed: false });
    }

    const { error: insertErr } = await supabase
      .from('users')
      .insert([{
        email: rawEmail,
        name: rawEmail.split('@')[0],
        provider: 'newsletter',
        newsletter_subscribed_at: new Date().toISOString(),
      }]);

    if (insertErr) {
      console.error('[subscribe] insert failed', insertErr);
      return res.status(500).json({ ok: false, message: 'Subscribe failed' });
    }

    return res.status(201).json({ ok: true, alreadySubscribed: false });
  } catch (err) {
    console.error('[subscribe] unhandled', err);
    return res.status(500).json({ ok: false, message: 'Internal server error' });
  }
}
