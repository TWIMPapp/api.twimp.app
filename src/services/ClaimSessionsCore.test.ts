import { test } from 'node:test';
import assert from 'node:assert/strict';
import { claimSessions, recordConsent } from './ClaimSessionsCore.ts';

// Tiny in-memory stand-in for the Supabase query builder.
function mockDb(tables: Record<string, any[]>, missingCols: string[] = []) {
    return {
        tables,
        from(name: string) {
            const rows = tables[name];
            const filters: ((r: any) => boolean)[] = [];
            let patch: any = null;
            const q: any = {
                select() { return q; },
                update(p: any) { patch = p; return q; },
                eq(c: string, v: any) { filters.push(r => r[c] === v); return q; },
                in(c: string, v: any[]) { filters.push(r => v.includes(r[c])); return q; },
                is(c: string, v: any) { filters.push(r => (r[c] ?? null) === v); return q; },
                then(res: any) {
                    if (patch && Object.keys(patch).some(k => missingCols.includes(k))) {
                        return Promise.resolve({ data: null, error: { code: 'PGRST204', message: 'column not found' } }).then(res);
                    }
                    const hit = rows.filter(r => filters.every(f => f(r)));
                    if (patch) hit.forEach(r => Object.assign(r, patch));
                    return Promise.resolve({ data: hit, error: null }).then(res);
                },
            };
            return q;
        },
    };
}

const ANON = '11111111-1111-4111-8111-111111111111';
const ACCT = '22222222-2222-4222-8222-222222222222';
const OTHER = '33333333-3333-4333-8333-333333333333';

function fixture() {
    return mockDb({
        users: [
            { id: 'u1', email: 'ross@example.com', twimp_user_id: ACCT },
            { id: 'u2', email: 'eve@example.com', twimp_user_id: OTHER },
        ],
        game_sessions: [
            { id: 's1', user_id: ANON, trail_ref: 'monsters-wimborne' },
            { id: 's2', user_id: ANON, trail_ref: 'dup-trail' },
            { id: 's3', user_id: ACCT, trail_ref: 'dup-trail' },
            { id: 's4', user_id: OTHER, trail_ref: 'eve-trail' },
        ],
    });
}

test('moves anonymous sessions; new one replaces an existing same-trail session, old row archived', async () => {
    const db = fixture();
    const r = await claimSessions('Ross@example.com', ANON, { db, now: () => 1700000000000 });
    assert.ok(r.ok);
    if (!r.ok) return;
    assert.deepEqual(r.claimed.sort(), ['dup-trail', 'monsters-wimborne']);
    assert.deepEqual(r.skipped_conflicts, []);
    const byId = (id: string) => db.tables.game_sessions.find(s => s.id === id);
    assert.equal(byId('s1').user_id, ACCT);
    assert.equal(byId('s2').user_id, ACCT); // new anonymous session now the account's
    assert.equal(byId('s3').user_id, `archived:${ACCT}:1700000000000`); // old one kept, recoverable
    assert.deepEqual(r.replaced, [{ trail_ref: 'dup-trail', archived_as: `archived:${ACCT}:1700000000000` }]);
    // Exactly one live row per (user, trail)
    const live = db.tables.game_sessions.filter(s => s.user_id === ACCT && s.trail_ref === 'dup-trail');
    assert.equal(live.length, 1);
});

test('idempotent: second call claims nothing new', async () => {
    const db = fixture();
    await claimSessions('ross@example.com', ANON, { db });
    const r = await claimSessions('ross@example.com', ANON, { db });
    assert.ok(r.ok && r.claimed.length === 0);
});

test('refuses an id linked to another account', async () => {
    const db = fixture();
    const r = await claimSessions('ross@example.com', OTHER, { db });
    assert.ok(!r.ok && r.status === 409);
    assert.equal(db.tables.game_sessions.find(s => s.id === 's4').user_id, OTHER);
});

test('own id is a no-op', async () => {
    const r = await claimSessions('ross@example.com', ACCT, { db: fixture() });
    assert.ok(r.ok && r.already_owned && r.claimed.length === 0);
});

test('rejects non-UUID ids and unknown accounts', async () => {
    assert.equal((await claimSessions('ross@example.com', 'x', { db: fixture() }) as any).status, 400);
    assert.equal((await claimSessions('nobody@example.com', ANON, { db: fixture() }) as any).status, 404);
});

test('account with no player id adopts the anonymous one', async () => {
    const db = fixture();
    db.tables.users[0].twimp_user_id = null;
    const r = await claimSessions('ross@example.com', ANON, { db });
    assert.ok(r.ok && r.target_user_id === ANON);
    assert.equal(db.tables.users[0].twimp_user_id, ANON);
});

test('dry run changes nothing', async () => {
    const db = fixture();
    const r = await claimSessions('ross@example.com', ANON, { db, dryRun: true });
    assert.ok(r.ok && r.claimed.length === 2);
    assert.equal(db.tables.game_sessions.find(s => s.id === 's1').user_id, ANON);
});

test('dry run reports replacement without archiving', async () => {
    const db = fixture();
    const r = await claimSessions('ross@example.com', ANON, { db, dryRun: true });
    assert.ok(r.ok && r.replaced.length === 1);
    assert.equal(db.tables.game_sessions.find(s => s.id === 's3').user_id, ACCT);
});

test('records marketing consent with timestamp', async () => {
    const db = fixture();
    const r = await claimSessions('ross@example.com', ANON, { db, marketingConsentAt: '2026-10-31T17:05:00Z' });
    assert.ok(r.ok && r.consent_recorded);
    assert.equal(db.tables.users[0].newsletter_subscribed_at, '2026-10-31T17:05:00.000Z');
    assert.equal(db.tables.users[1].newsletter_subscribed_at, undefined);
    // Earlier consent is not overwritten
    await claimSessions('ross@example.com', ANON, { db, marketingConsentAt: '2027-01-01T00:00:00Z' });
    assert.equal(db.tables.users[0].newsletter_subscribed_at, '2026-10-31T17:05:00.000Z');
});

test('no consent recorded when not ticked', async () => {
    const db = fixture();
    const r = await claimSessions('ross@example.com', ANON, { db });
    assert.ok(r.ok && !r.consent_recorded);
    assert.equal(db.tables.users[0].newsletter_subscribed_at, undefined);
});

test('consent column missing: claim still succeeds', async () => {
    const db = mockDb(fixture().tables, ['newsletter_subscribed_at']);
    const r = await claimSessions('ross@example.com', ANON, { db, marketingConsentAt: '2026-10-31T17:05:00Z' });
    assert.ok(r.ok && r.consent_recorded === false && r.claimed.length === 2);
});

test('consent also recorded on the already-owned path, bad timestamp ignored', async () => {
    const db = fixture();
    const r = await claimSessions('ross@example.com', ACCT, { db, marketingConsentAt: '2026-10-31T17:05:00Z' });
    assert.ok(r.ok && r.already_owned && r.consent_recorded);
    assert.equal(await recordConsent(db, 'u1', 'not-a-date'), false);
});
