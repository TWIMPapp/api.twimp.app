// Pure logic (no imports) so it can be unit-tested with a mock DB.
export type Db = { from: (table: string) => any };
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type ClaimResult =
    | { ok: true; target_user_id: string; claimed: string[]; replaced: { trail_ref: string; archived_as: string }[]; skipped_conflicts: string[]; already_owned?: boolean; consent_recorded?: boolean; dry_run?: boolean }
    | { ok: false; status: number; error: string };


/**
 * Move game_sessions from an anonymous twimp_user_id onto the account
 * identified by `email`. The caller MUST have verified `email` already
 * (the game's /api/claim-sessions does this from the NextAuth session).
 *
 * Rules:
 *  - anon_id must be a UUID (the format the game generates).
 *  - If anon_id is linked to any OTHER account it is not anonymous: refuse.
 *  - If it is already this account's id: nothing to do (idempotent).
 *  - Sessions whose trail_ref the account already has are left alone
 *    (UNIQUE(user_id, trail_ref)); reported as skipped_conflicts.
 *  - Each update is guarded with user_id = anon_id, so repeats/races are no-ops.
 */
export async function claimSessions(
    email: string,
    anonId: string,
    opts: { dryRun?: boolean; db: Db | null; marketingConsentAt?: string | null; now?: () => number }
): Promise<ClaimResult> {
    const db = opts.db;
    const now = opts.now || Date.now;
    if (!db) return { ok: false, status: 503, error: 'Database not configured' };
    if (!email || typeof email !== 'string') return { ok: false, status: 400, error: 'email required' };
    if (!anonId || typeof anonId !== 'string' || !UUID_RE.test(anonId)) {
        return { ok: false, status: 400, error: 'anon_id must be a UUID' };
    }

    const normalised = email.toLowerCase().trim();
    const { data: users, error: userErr } = await db
        .from('users')
        .select('id, email, twimp_user_id')
        .in('email', Array.from(new Set([email.trim(), normalised])));
    if (userErr) return { ok: false, status: 500, error: 'User lookup failed' };
    const user = (users || [])[0];
    if (!user) return { ok: false, status: 404, error: 'Account not found' };

    const consent_recorded = opts.marketingConsentAt && !opts.dryRun
        ? await recordConsent(db, user.id, opts.marketingConsentAt)
        : false;

    // Is the anonymous id already linked to some account?
    const { data: owners, error: ownerErr } = await db
        .from('users')
        .select('id')
        .eq('twimp_user_id', anonId);
    if (ownerErr) return { ok: false, status: 500, error: 'Owner lookup failed' };
    const otherOwner = (owners || []).find((o: any) => o.id !== user.id);
    if (otherOwner) return { ok: false, status: 409, error: 'That player id belongs to another account' };

    let target: string | null = user.twimp_user_id || null;
    if (target === anonId) {
        return { ok: true, target_user_id: target, claimed: [], replaced: [], skipped_conflicts: [], already_owned: true, consent_recorded, dry_run: opts.dryRun };
    }
    if (!target) {
        // Account has no player id yet: simply adopt the anonymous one.
        if (!opts.dryRun) {
            const { error } = await db.from('users').update({ twimp_user_id: anonId }).eq('id', user.id).is('twimp_user_id', null);
            if (error) return { ok: false, status: 500, error: 'Link failed' };
        }
        return { ok: true, target_user_id: anonId, claimed: [], replaced: [], skipped_conflicts: [], already_owned: true, consent_recorded, dry_run: opts.dryRun };
    }

    const { data: anonSessions, error: aErr } = await db
        .from('game_sessions').select('id, trail_ref').eq('user_id', anonId);
    if (aErr) return { ok: false, status: 500, error: 'Session lookup failed' };
    const { data: ownSessions, error: oErr } = await db
        .from('game_sessions').select('id, trail_ref').eq('user_id', target);
    if (oErr) return { ok: false, status: 500, error: 'Session lookup failed' };

    const owned = new Map<string, string>((ownSessions || []).map((s: any) => [s.trail_ref, s.id]));
    const claimed: string[] = [];
    const replaced: { trail_ref: string; archived_as: string }[] = [];
    const skipped: string[] = [];
    for (const s of anonSessions || []) {
        const oldId = owned.get(s.trail_ref);
        // The newly played anonymous session wins. The account's old row is
        // moved aside (not deleted) under an archive user_id so it stays
        // recoverable and frees the UNIQUE(user_id, trail_ref) slot.
        const archivedAs = `archived:${target}:${now()}`;
        if (oldId && !opts.dryRun) {
            const { error } = await db.from('game_sessions')
                .update({ user_id: archivedAs, updated_at: new Date(now()).toISOString() })
                .eq('id', oldId).eq('user_id', target);
            if (error) { skipped.push(s.trail_ref); continue; }
        }
        if (!opts.dryRun) {
            const { error } = await db.from('game_sessions')
                .update({ user_id: target, updated_at: new Date(now()).toISOString() })
                .eq('id', s.id).eq('user_id', anonId);
            if (error) {
                // Put the old row back so the account isn't left without it.
                if (oldId) await db.from('game_sessions').update({ user_id: target }).eq('id', oldId).eq('user_id', archivedAs);
                skipped.push(s.trail_ref);
                continue;
            }
        }
        claimed.push(s.trail_ref);
        if (oldId) replaced.push({ trail_ref: s.trail_ref, archived_as: archivedAs });
    }
    return { ok: true, target_user_id: target, claimed, replaced, skipped_conflicts: skipped, consent_recorded, dry_run: opts.dryRun };
}

/**
 * Record opt-in marketing consent (the unticked-by-default checkbox) in the
 * existing users.newsletter_subscribed_at column, the same one /subscribe
 * uses. Keeps the earliest consent time (only set when NULL). If the column
 * is ever missing the error is logged and the claim still succeeds.
 */
export async function recordConsent(db: Db, userId: string, at: string): Promise<boolean> {
    const ts = new Date(at);
    if (isNaN(ts.getTime())) return false;
    const { error } = await db.from('users')
        .update({ newsletter_subscribed_at: ts.toISOString() })
        .eq('id', userId)
        .is('newsletter_subscribed_at', null);
    if (error) {
        console.warn('[claim-sessions] consent not recorded', error.code || '', error.message || '');
        return false;
    }
    return true;
}
