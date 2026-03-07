import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ApiKeyService } from '../src/services/ApiKeyService';

export function cors(res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, baggage, sentry-trace');
}

/**
 * Extract creator_id from API key if Authorization header is present.
 * Returns null if no key provided (caller should fall back to body creator_id).
 * Returns { error } if key is provided but invalid.
 */
export async function resolveCreatorFromApiKey(req: VercelRequest): Promise<{ creator_id: string } | { error: string } | null> {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null; // No API key — fall back to existing behaviour
    }

    const key = authHeader.slice(7);
    const result = await ApiKeyService.validateKey(key);

    if (!result.valid || !result.creator_id) {
        return { error: 'Invalid or inactive API key' };
    }

    return { creator_id: result.creator_id };
}

export function handleOptions(req: VercelRequest, res: VercelResponse): boolean {
    cors(res);
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return true;
    }
    return false;
}
