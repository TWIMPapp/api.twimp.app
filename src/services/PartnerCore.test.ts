import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toPartner, partnerSummary, trailCredits } from './PartnerCore.ts';

const wcsRow = { id: 'p1', slug: 'wimborne-civic-society', name: 'Wimborne Civic Society', logo_url: null, url: 'https://www.wimbornecivicsoc.org.uk/', created_at: 'x' };

test('toPartner keeps the display fields and drops extras', () => {
    assert.deepEqual(toPartner(wcsRow), { id: 'p1', slug: 'wimborne-civic-society', name: 'Wimborne Civic Society', logo_url: null, url: 'https://www.wimbornecivicsoc.org.uk/' });
});

test('toPartner rejects rows without id, slug or name', () => {
    assert.equal(toPartner({ ...wcsRow, name: '' }), null);
    assert.equal(toPartner({ ...wcsRow, slug: null }), null);
    assert.equal(toPartner(null), null);
});

test('toPartner treats blank logo_url/url as null', () => {
    assert.equal(toPartner({ ...wcsRow, logo_url: '  ', url: '' })?.logo_url, null);
    assert.equal(toPartner({ ...wcsRow, logo_url: '  ', url: '' })?.url, null);
});

test('partnerSummary resolves partner_id to {name, logo_url, url, slug}', () => {
    const byId = new Map([['p1', toPartner({ ...wcsRow, logo_url: 'https://x/logo.png' })!]]);
    assert.deepEqual(partnerSummary('p1', byId), { name: 'Wimborne Civic Society', logo_url: 'https://x/logo.png', url: 'https://www.wimbornecivicsoc.org.uk/', slug: 'wimborne-civic-society' });
});

test('partnerSummary is null when there is no partner or it is unknown', () => {
    const byId = new Map([['p1', toPartner(wcsRow)!]]);
    assert.equal(partnerSummary(null, byId), null);
    assert.equal(partnerSummary(undefined, byId), null);
    assert.equal(partnerSummary('missing', byId), null);
    assert.equal(partnerSummary('p1', new Map()), null);
});

test('trailCredits returns trimmed credits text or null', () => {
    assert.equal(trailCredits({ credits: ' Route adapted from X. ' }), 'Route adapted from X.');
    assert.equal(trailCredits({ credits: '' }), null);
    assert.equal(trailCredits({ credits: 42 }), null);
    assert.equal(trailCredits({}), null);
    assert.equal(trailCredits(undefined), null);
});
