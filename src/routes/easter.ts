import { Router } from 'express';
import { EasterEventService } from '../services/EasterEventService';
import { SessionService } from '../services/SessionService';

const router = Router();

// ===== Easter Event API (5 endpoints) =====

// 1. Start or resume game
router.post('/easter_event/start', async (req, res) => {
    const { user_id, lat, lng } = req.body;
    const result = await EasterEventService.startOrResumeGame(user_id, parseFloat(lat), parseFloat(lng));
    res.json({ body: result });
});

// 2. Location check (Are We There Yet)
router.post('/easter_event/awty', async (req, res) => {
    const { user_id, lat, lng } = req.body;
    const result = await EasterEventService.handleAWTY(user_id, parseFloat(lat), parseFloat(lng));
    res.json({ body: result });
});

// 3. Game screen data (includes puzzle status, missions, clues, codex, spawn radius)
router.get('/easter_event/game-screen', async (req, res) => {
    const { user_id } = req.query;
    const result = await EasterEventService.getGameScreenData(user_id as string);
    res.json({ body: result });
});

// 4. Get chapter content
router.get('/easter_event/chapter/:id', (req, res) => {
    const chapterId = parseInt(req.params.id);
    const result = EasterEventService.getChapterContent(chapterId);
    res.json({ body: result });
});

// 5. Consolidated action endpoint - handles collect, puzzle, acknowledge, hazard, restart, reset-spawn
router.post('/easter_event/:action', async (req, res) => {
    const { action } = req.params;
    const { user_id, answer, puzzle_id, lat, lng } = req.body;

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
});

export default router;
