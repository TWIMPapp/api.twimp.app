import { test } from 'node:test';
import assert from 'node:assert/strict';
import { claimSessions } from './ClaimSessionsCore.ts';

// Tiny in-memory stand-in for the Supabase query builder.
function mockDb(tables: Record<string, any[]>) {
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

test('moves unclaimed anonymous sessions, skips trail conflicts', async () => {
    const db = fixture();
    const r = await claimSessions('Ross@example.com', ANON, { db });
    assert.ok(r.ok);
    if (!r.ok) return;
    assert.deepEqual(r.claimed, ['monsters-wimborne']);
    assert.deepEqual(r.skipped_conflicts, ['dup-trail']);
    assert.equal(db.tables.game_sessions.find(s => s.id === 's1').user_id, ACCT);
    assert.equal(db.tables.game_sessions.find(s => s.id === 's2').user_id, ANON);
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
    assert.ok(r.ok && r.claimed.length === 1);
    assert.equal(db.tables.game_sessions.find(s => s.id === 's1').user_id, ANON);
});
