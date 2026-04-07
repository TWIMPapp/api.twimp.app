import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ApiKeyService } from '../src/services/ApiKeyService';

export function cors(res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Cache-Control, Pragma, baggage, sentry-trace');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
}

/**
 * Extract creator_id and per-key game limits from API key if Authorization header is present.
 * Returns null if no key provided (caller should fall back to body creator_id).
 * Returns { error } if key is provided but invalid.
 */
export async function resolveCreatorFromApiKey(req: VercelRequest): Promise<
    | { creator_id: string; max_active_games?: number; max_total_games?: number }
    | { error: string }
    | null
> {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null; // No API key — fall back to existing behaviour
    }

    const key = authHeader.slice(7);
    const result = await ApiKeyService.validateKey(key);

    if (!result.valid || !result.creator_id) {
        return { error: 'Invalid or inactive API key' };
    }

    return {
        creator_id: result.creator_id,
        max_active_games: result.max_active_games,
        max_total_games: result.max_total_games,
    };
}

export function handleOptions(req: VercelRequest, res: VercelResponse): boolean {
    cors(res);
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return true;
    }
    return false;
}
