import { supabase, isSupabaseConfigured } from '../config/supabase';
import crypto from 'crypto';

export class ApiKeyService {
    static generateKey(): string {
        return `twimp_${crypto.randomBytes(24).toString('hex')}`;
    }

    static async createKey(creatorId: string, name?: string): Promise<{ ok: boolean; key?: string; message?: string }> {
        if (!isSupabaseConfigured()) {
            return { ok: false, message: 'Database not configured' };
        }

        const key = this.generateKey();

        const { error } = await supabase!
            .from('api_keys')
            .insert({ key, creator_id: creatorId, name: name || null });

        if (error) {
            return { ok: false, message: error.message };
        }

        return { ok: true, key };
    }

    static async validateKey(key: string): Promise<{ valid: boolean; creator_id?: string }> {
        if (!isSupabaseConfigured() || !key) {
            return { valid: false };
        }

        const { data, error } = await supabase!
            .from('api_keys')
            .select('creator_id')
            .eq('key', key)
            .eq('active', true)
            .single();

        if (error || !data) {
            return { valid: false };
        }

        return { valid: true, creator_id: data.creator_id };
    }
}
