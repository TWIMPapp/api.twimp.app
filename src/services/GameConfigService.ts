import { supabase, isSupabaseConfigured } from '../config/supabase';

export type GameStatus = 'active' | 'featured' | 'pending' | 'inactive';

export interface GameConfig {
    ref: string;
    gameType: 'trail' | 'universal';
    status: GameStatus;
    // Eventbrite event id to copy from when minting a per-date event for this
    // game. Null if no template configured.
    eventbriteTemplateId: string | null;
}

// In-memory cache with TTL
let configCache: GameConfig[] | null = null;
let cacheTime: number = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute cache

// Hardcoded playtest / fallback rows. Merged after DB (DB wins on same ref).
// Used when Supabase is down/empty so a pending trail can still appear for
// direct-URL playtesting.
const FALLBACK_CONFIG: GameConfig[] = [
    { ref: 'easter-event', gameType: 'universal', status: 'featured', eventbriteTemplateId: null },
    { ref: 'the-eggstraordinary-case-of-the-missing-eggs-frome', gameType: 'trail', status: 'pending', eventbriteTemplateId: null },
    { ref: 'what-the-heath-was-watching', gameType: 'trail', status: 'pending', eventbriteTemplateId: null },
];

function mergeWithFallback(rows: GameConfig[]): GameConfig[] {
    const byRef = new Map<string, GameConfig>();
    for (const row of FALLBACK_CONFIG) byRef.set(row.ref, row);
    for (const row of rows) byRef.set(row.ref, row); // DB wins
    return Array.from(byRef.values());
}

export class GameConfigService {
    static async getAll(): Promise<GameConfig[]> {
        // Check cache first
        if (configCache && Date.now() - cacheTime < CACHE_TTL_MS) {
            return configCache;
        }

        if (!isSupabaseConfigured()) {
            configCache = FALLBACK_CONFIG;
            cacheTime = Date.now();
            return configCache;
        }

        try {
            const { data, error } = await supabase!
                .from('game_config')
                .select('*');

            if (error) {
                console.error('Supabase getGameConfig error:', error);
                configCache = mergeWithFallback(configCache || []);
                cacheTime = Date.now();
                return configCache;
            }

            const mapped = (data || []).map((d: any) => ({
                ref: d.ref,
                gameType: d.game_type,
                status: d.status as GameStatus,
                eventbriteTemplateId: d.eventbrite_template_id ?? null,
            }));
            configCache = mergeWithFallback(mapped);
            cacheTime = Date.now();

            return configCache;
        } catch (e) {
            console.error('Failed to get game config from Supabase:', e);
            configCache = mergeWithFallback(configCache || []);
            cacheTime = Date.now();
            return configCache;
        }
    }

    static async getFeatured(): Promise<GameConfig[]> {
        const all = await this.getAll();
        return all.filter(c => c.status === 'featured');
    }

    static async getActive(): Promise<GameConfig[]> {
        const all = await this.getAll();
        return all.filter(c => c.status === 'active' || c.status === 'featured');
    }

    static async getPending(): Promise<GameConfig[]> {
        const all = await this.getAll();
        return all.filter(c => c.status === 'pending');
    }

    static async getStatus(ref: string): Promise<GameStatus> {
        const all = await this.getAll();
        const config = all.find(c => c.ref === ref);
        // Temporarily default to inactive until all trails are added to game_config
        return config ? config.status : 'inactive';
    }

    static async isPlayable(ref: string): Promise<boolean> {
        const status = await this.getStatus(ref);
        return status === 'active' || status === 'featured';
    }

    static async isFeatured(ref: string): Promise<boolean> {
        const status = await this.getStatus(ref);
        return status === 'featured';
    }

    static async isPending(ref: string): Promise<boolean> {
        const status = await this.getStatus(ref);
        return status === 'pending';
    }

    // Clear cache (useful after updates)
    static clearCache() {
        configCache = null;
        cacheTime = 0;
    }
}
