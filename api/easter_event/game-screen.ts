import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from '../_utils';
import { EasterEventService } from '../../src/services/EasterEventService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    const { user_id, test_day, tk } = req.query;

    // Allow test_day override for testing — requires secret key in URL
    if (test_day !== undefined) {
        if (tk !== 'eggstra26') {
            return res.status(403).json({ body: { error: 'Unauthorised' } });
        }
        const { EASTER_EVENT_CONFIG } = require('../../src/data/easter_event/config');
        EASTER_EVENT_CONFIG.TEST_DAY_OVERRIDE = parseInt(test_day as string);
    }

    const result = await EasterEventService.getGameScreenData(user_id as string);
    res.json({ body: result });
}
