import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from '../../_utils';
import { EasterEventService } from '../../../src/services/EasterEventService';

export default function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    const { id, test_day, tk } = req.query;

    // Allow test_day override for testing — requires secret key in URL
    const { EASTER_EVENT_CONFIG } = require('../../../src/data/easter_event/config');
    const originalOverride = EASTER_EVENT_CONFIG.TEST_DAY_OVERRIDE;
    if (test_day !== undefined) {
        if (tk !== 'eggstra26') {
            return res.status(403).json({ body: { error: 'Unauthorised' } });
        }
        EASTER_EVENT_CONFIG.TEST_DAY_OVERRIDE = parseInt(test_day as string);
    }

    try {
        const chapterId = parseInt(id as string);
        const result = EasterEventService.getChapterContent(chapterId);
        res.json({ body: result });
    } finally {
        EASTER_EVENT_CONFIG.TEST_DAY_OVERRIDE = originalOverride;
    }
}
