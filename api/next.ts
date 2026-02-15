import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from './_utils';
import { EasterEventService } from '../src/services/EasterEventService';
import { DinoHuntService } from '../src/services/DinoHuntService';
import { CustomTrailService } from '../src/services/CustomTrailService';
import { GameEngineService } from '../src/services/GameEngineService';
import { SessionService } from '../src/services/SessionService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, message: 'Method not allowed' });
    }

    const { game_ref, trail_ref, user_id, action, answer, puzzle_id, lat, lng } = req.body;
    const ref = game_ref || trail_ref; // Support both for backwards compatibility

    if (!ref || !user_id) {
        return res.status(400).json({ ok: false, message: "Missing game_ref or user_id" });
    }

    // Easter Event uses action-based routing
    if (ref === 'easter-event') {
        switch (action) {
            case 'collect':
                return res.json({ body: await EasterEventService.collectEgg(user_id, answer || '') });

            case 'puzzle':
                return res.json({ body: await EasterEventService.submitPuzzleAnswer(user_id, puzzle_id, answer) });

            case 'acknowledge':
                return res.json({ body: await EasterEventService.acknowledgeSafety(user_id) });

            case 'hazard':
                return res.json({ body: await EasterEventService.reportHazard(user_id) });

            case 'restart':
                await SessionService.clearUniversalSession(user_id, 'EASTER_EVENT');
                return res.json({ body: { ok: true, message: "Easter Event game restarted" } });

            case 'reset-spawn':
                if (!lat || !lng) {
                    return res.status(400).json({ ok: false, message: "lat and lng required for reset-spawn" });
                }
                return res.json({ body: await EasterEventService.resetSpawnLocation(user_id, parseFloat(lat), parseFloat(lng)) });

            default:
                return res.status(400).json({ ok: false, message: `Unknown action: ${action}` });
        }
    }

    // Dino Egg Hunt
    if (ref === 'dino-hunt') {
        const { answer_index, nickname, dino_id, dino_data, option_rarities } = req.body;
        switch (action) {
            case 'choose-dino':
                return res.json({ body: await DinoHuntService.chooseFavoriteDino(user_id, dino_id) });
            case 'answer-question':
                return res.json({ body: await DinoHuntService.answerQuestion(user_id, parseInt(answer_index), option_rarities) });
            case 'name-dino':
                return res.json({ body: await DinoHuntService.nameDino(user_id, nickname, dino_data) });
            case 'collect-golden-egg':
                return res.json({ body: await DinoHuntService.collectGoldenEgg(user_id) });
            case 'report-hazard': {
                const { egg_index, hazard_category } = req.body;
                if (egg_index === undefined || !hazard_category || !lat || !lng) {
                    return res.status(400).json({ ok: false, message: 'egg_index, hazard_category, lat, lng required' });
                }
                return res.json({ body: await DinoHuntService.reportUnreachableEgg(
                    user_id, parseInt(egg_index), hazard_category, parseFloat(lat), parseFloat(lng)
                )});
            }
            case 'restart':
                await SessionService.clearUniversalSession(user_id, 'DINO_HUNT');
                return res.json({ body: { ok: true, message: 'Dino Hunt restarted' } });
            default:
                return res.status(400).json({ ok: false, message: `Unknown dino-hunt action: ${action}` });
        }
    }

    // Custom Trail games
    if (ref.startsWith('custom-trail-')) {
        const trailId = ref.replace('custom-trail-', '');
        const { pin_index } = req.body;
        switch (action) {
            case 'collect':
                const collectResult = await CustomTrailService.collectPin(user_id, trailId, answer, pin_index);
                return res.json({ body: collectResult });
            case 'report-hazard': {
                const { pin_index: hazardPinIndex, hazard_category } = req.body;
                if (hazardPinIndex === undefined || !hazard_category || !lat || !lng) {
                    return res.status(400).json({ ok: false, message: 'pin_index, hazard_category, lat, lng required' });
                }
                return res.json({ body: await CustomTrailService.reportUnreachablePin(
                    user_id, trailId, parseInt(hazardPinIndex), hazard_category, parseFloat(lat), parseFloat(lng)
                )});
            }
            case 'creator-report-hazard': {
                const { creator_id, pin_index: creatorPinIndex, hazard_category: creatorCategory } = req.body;
                if (!creator_id || creatorPinIndex === undefined || !creatorCategory) {
                    return res.status(400).json({ ok: false, message: 'creator_id, pin_index, hazard_category required' });
                }
                return res.json({ body: await CustomTrailService.creatorReportPin(
                    creator_id, trailId, parseInt(creatorPinIndex), creatorCategory
                )});
            }
            case 'restart':
                const gameType = `CUSTOM_TRAIL_${trailId}`;
                await SessionService.clearUniversalSession(user_id, gameType);
                return res.json({ body: { ok: true, message: 'Trail restarted' } });
            default:
                return res.status(400).json({ ok: false, message: `Unknown action: ${action}` });
        }
    }

    // Trail games use GameEngine
    const result = await GameEngineService.handleNext(user_id, ref, answer);
    res.json({ body: result });
}
