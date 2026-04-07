import { supabase, isSupabaseConfigured } from '../config/supabase';
import crypto from 'crypto';

export class ApiKeyService {
    static generateKey(): string {
        return `twimp_${crypto.randomBytes(24).toString('hex')}`;
    }

    static async createKey(
        creatorId: string,
        name?: string,
        maxActiveGames?: number,
        maxTotalGames?: number
    ): Promise<{ ok: boolean; key?: string; message?: string }> {
        if (!isSupabaseConfigured()) {
            return { ok: false, message: 'Database not configured' };
        }

        const key = this.generateKey();

        const row: any = { key, creator_id: creatorId, name: name || null };
        if (maxActiveGames !== undefined) row.max_active_games = maxActiveGames;
        if (maxTotalGames !== undefined) row.max_total_games = maxTotalGames;

        const { error } = await supabase!
            .from('api_keys')
            .insert(row);

        if (error) {
            return { ok: false, message: error.message };
        }

        return { ok: true, key };
    }

    static async validateKey(key: string): Promise<{
        valid: boolean;
        creator_id?: string;
        max_active_games?: number;
        max_total_games?: number;
    }> {
        if (!isSupabaseConfigured() || !key) {
            return { valid: false };
        }

        const { data, error } = await supabase!
            .from('api_keys')
            .select('creator_id, max_active_games, max_total_games')
            .eq('key', key)
            .eq('active', true)
            .single();

        if (error || !data) {
            return { valid: false };
        }

        return {
            valid: true,
            creator_id: data.creator_id,
            max_active_games: data.max_active_games ?? undefined,
            max_total_games: data.max_total_games ?? undefined,
        };
    }
}
