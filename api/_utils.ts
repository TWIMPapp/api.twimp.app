import type { VercelRequest, VercelResponse } from '@vercel/node';

export function cors(res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, baggage, sentry-trace');
}

export function handleOptions(req: VercelRequest, res: VercelResponse): boolean {
    cors(res);
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return true;
    }
    return false;
}
