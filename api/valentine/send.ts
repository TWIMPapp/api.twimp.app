import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from '../_utils';
import { ValentineService } from '../../src/services/ValentineService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { trailId, recipientEmail } = req.body;

    if (!trailId || !recipientEmail) {
        return res.status(400).json({
            success: false,
            message: 'trailId and recipientEmail are required'
        });
    }

    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
        || req.socket?.remoteAddress
        || 'unknown';

    const result = await ValentineService.sendValentineEmail(
        trailId,
        recipientEmail,
        clientIp
    );

    if (!result.success) {
        return res.status(400).json(result);
    }

    res.json(result);
}
