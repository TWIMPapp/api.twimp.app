import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from './_utils';
import { TrailService } from '../src/services/TrailService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);
    res.setHeader('Cache-Control', 'no-store');

    if (req.method !== 'GET') {
        return res.status(405).json({ ok: false, message: 'Method not allowed' });
    }

    const { lat, lng, user_id } = req.query;

    const result = await TrailService.getTrailSummaries(
        lat ? parseFloat(lat as string) : undefined,
        lng ? parseFloat(lng as string) : undefined,
        user_id as string
    );

    res.json(result);
}
