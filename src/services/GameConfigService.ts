import { supabase, isSupabaseConfigured } from '../config/supabase.js';

export interface GameConfig {
    ref: string;
    gameType: 'trail' | 'universal';
    active: boolean;
    featured: boolean;
    displayOrder: number;
}

// In-memory cache with TTL
let configCache: GameConfig[] | null = null;
let cacheTime: number = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute cache

export class GameConfigService {
    static async getAll(): Promise<GameConfig[]> {
        // Check cache first
        if (configCache && Date.now() - cacheTime < CACHE_TTL_MS) {
            return configCache;
        }

        if (!isSupabaseConfigured()) {
            // Fallback defaults when Supabase not configured
            return [
                { ref: 'egg-hunt', gameType: 'universal', active: true, featured: true, displayOrder: 1 },
                { ref: 'easter-event', gameType: 'universal', active: false, featured: false, displayOrder: 2 }
            ];
        }

        try {
            const { data, error } = await supabase!
                .from('game_config')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) {
                console.error('Supabase getGameConfig error:', error);
                return configCache || [];
            }

            configCache = (data || []).map((d: any) => ({
                ref: d.ref,
                gameType: d.game_type,
                active: d.active,
                featured: d.featured,
                displayOrder: d.display_order
            }));
            cacheTime = Date.now();

            return configCache;
        } catch (e) {
            console.error('Failed to get game config from Supabase:', e);
            return configCache || [];
        }
    }

    static async getFeatured(): Promise<GameConfig[]> {
        const all = await this.getAll();
        return all.filter(c => c.active && c.featured);
    }

    static async isActive(ref: string): Promise<boolean> {
        const all = await this.getAll();
        const config = all.find(c => c.ref === ref);
        // If not in config, default to active (for trails not yet added)
        return config ? config.active : true;
    }

    static async isFeatured(ref: string): Promise<boolean> {
        const all = await this.getAll();
        const config = all.find(c => c.ref === ref);
        return config ? config.featured : false;
    }

    // Clear cache (useful after updates)
    static clearCache() {
        configCache = null;
        cacheTime = 0;
    }
}
