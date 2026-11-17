import { supabase, isSupabaseConfigured } from '../config/supabase';
import { Partner, toPartner } from './PartnerCore';

export type { Partner, PartnerSummary } from './PartnerCore';

// In-memory cache with TTL (same pattern as GameConfigService).
let partnerCache: Partner[] | null = null;
let cacheTime = 0;
const CACHE_TTL_MS = 60 * 1000;

export class PartnerService {
    /**
     * All partners. Never throws: if Supabase is unconfigured, or the partners
     * table doesn't exist yet (migration 005 not applied), returns the last
     * good list or []. /list then simply reports partner: null.
     */
    static async getAll(): Promise<Partner[]> {
        if (partnerCache && Date.now() - cacheTime < CACHE_TTL_MS) return partnerCache;
        if (!isSupabaseConfigured()) {
            partnerCache = [];
            cacheTime = Date.now();
            return partnerCache;
        }
        try {
            const { data, error } = await supabase!
                .from('partners')
                .select('id, slug, name, logo_url, url');
            if (error) {
                console.error('Supabase getPartners error:', error);
                partnerCache = partnerCache || [];
            } else {
                partnerCache = (data || []).map(toPartner).filter((p): p is Partner => p !== null);
            }
        } catch (e) {
            console.error('Failed to get partners from Supabase:', e);
            partnerCache = partnerCache || [];
        }
        cacheTime = Date.now();
        return partnerCache;
    }

    static async getById(): Promise<Map<string, Partner>> {
        const all = await this.getAll();
        return new Map(all.map(p => [p.id, p]));
    }

    static clearCache() {
        partnerCache = null;
        cacheTime = 0;
    }
}
