import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from '../_utils';
import { EasterEventService } from '../../src/services/EasterEventService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    const { user_id, action } = req.body;

    if (action === 'acknowledge') {
        const result = await EasterEventService.acknowledgeSafety(user_id);
        return res.json({ body: result });
    }

    if (action === 'report-hazard') {
        const result = await EasterEventService.reportHazard(user_id);
        return res.json({ body: result });
    }

    res.status(400).json({ ok: false, message: "Invalid action. Use 'acknowledge' or 'report-hazard'" });
}
