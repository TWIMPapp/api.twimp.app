import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from '../_utils';
import { TrailService } from '../../src/services/TrailService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);
    res.setHeader('Cache-Control', 'no-store');

    const { lat, lng, user_id } = req.query;
    const trails = await TrailService.getTrailSummaries(
        lat ? parseFloat(lat as string) : undefined,
        lng ? parseFloat(lng as string) : undefined,
        user_id as string
    );
    res.json(trails);
}
