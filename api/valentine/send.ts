import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from '../_utils';
import { ValentineService } from '../../src/services/ValentineService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { senderEmail, recipientEmail, message } = req.body;

    if (!senderEmail || !recipientEmail || !message) {
        return res.status(400).json({
            success: false,
            message: 'senderEmail, recipientEmail, and message are required'
        });
    }

    const result = await ValentineService.sendValentine(
        senderEmail,
        recipientEmail,
        message
    );

    if (!result.success) {
        return res.status(400).json(result);
    }

    res.json(result);
}
