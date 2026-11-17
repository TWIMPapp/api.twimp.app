// Pure partner helpers (no imports) so they can be unit-tested directly.

/** A row of the `partners` table (migrations/005_partners.sql). */
export interface Partner {
    id: string;
    slug: string;
    name: string;
    logo_url: string | null;
    url: string | null;
}

/** What /list returns per game under `partner` (null when there is none). */
export interface PartnerSummary {
    name: string;
    logo_url: string | null;
    url: string | null;
    slug: string;
}

const clean = (v: unknown): string | null =>
    typeof v === 'string' && v.trim() !== '' ? v.trim() : null;

/** Normalise a raw DB row; returns null if it lacks the required fields. */
export function toPartner(row: any): Partner | null {
    const id = clean(row?.id);
    const slug = clean(row?.slug);
    const name = clean(row?.name);
    if (!id || !slug || !name) return null;
    return { id, slug, name, logo_url: clean(row?.logo_url), url: clean(row?.url) };
}

/** Resolve a game's partner_id against the loaded partners. */
export function partnerSummary(
    partnerId: string | null | undefined,
    partnersById: Map<string, Partner>
): PartnerSummary | null {
    if (!partnerId) return null;
    const p = partnersById.get(partnerId);
    if (!p) return null;
    return { name: p.name, logo_url: p.logo_url, url: p.url, slug: p.slug };
}

/** Credits text from trail_data.credits, or null. */
export function trailCredits(trail: { credits?: unknown } | null | undefined): string | null {
    return clean(trail?.credits);
}
