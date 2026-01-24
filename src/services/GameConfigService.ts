import { supabase, isSupabaseConfigured } from '../config/supabase';

export type GameStatus = 'active' | 'featured' | 'pending' | 'inactive';

export interface GameConfig {
    ref: string;
    gameType: 'trail' | 'universal';
    status: GameStatus;
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
                { ref: 'easter-event', gameType: 'universal', status: 'featured' }
            ];
        }

        try {
            const { data, error } = await supabase!
                .from('game_config')
                .select('*');

            if (error) {
                console.error('Supabase getGameConfig error:', error);
                return configCache || [];
            }

            configCache = (data || []).map((d: any) => ({
                ref: d.ref,
                gameType: d.game_type,
                status: d.status as GameStatus
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
        // If not in config, default to active (for trails not yet added)
        return config ? config.status : 'active';
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
