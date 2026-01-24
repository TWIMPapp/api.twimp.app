import { Router } from 'express';
import { EasterEventService } from '../services/EasterEventService';
import { SessionService } from '../services/SessionService';

const router = Router();

// ===== Easter Event API (9 endpoints) =====

// 1. Start or resume game
router.post('/api/easter_event/start', async (req, res) => {
    const { user_id, lat, lng } = req.body;
    const result = await EasterEventService.startOrResumeGame(user_id, parseFloat(lat), parseFloat(lng));
    res.json({ body: result });
});

// 2. Location check (Are We There Yet)
router.post('/api/easter_event/awty', async (req, res) => {
    const { user_id, lat, lng } = req.body;
    const result = await EasterEventService.handleAWTY(user_id, parseFloat(lat), parseFloat(lng));
    res.json({ body: result });
});

// 3. Confirm arrival at egg (before question)
router.post('/api/easter_event/confirm-arrival', async (req, res) => {
    const { user_id } = req.body;
    const result = await EasterEventService.confirmArrival(user_id);
    res.json({ body: result });
});

// 4. Collect egg (answer question) - handles both regular and golden eggs
router.post('/api/easter_event/collect', async (req, res) => {
    const { user_id, answer, is_golden } = req.body;

    // Golden egg has no answer required
    if (is_golden) {
        const result = await EasterEventService.collectGoldenEgg(user_id);
        return res.json({ body: result });
    }

    const result = await EasterEventService.collectEgg(user_id, answer);
    res.json({ body: result });
});

// 5. Game screen data (includes puzzle status, missions, clues, codex, spawn radius)
router.get('/api/easter_event/game-screen', async (req, res) => {
    const { user_id } = req.query;
    const result = await EasterEventService.getGameScreenData(user_id as string);
    res.json({ body: result });
});

// 6. Get chapter content
router.get('/api/easter_event/chapter/:id', (req, res) => {
    const chapterId = parseInt(req.params.id);
    const result = EasterEventService.getChapterContent(chapterId);
    res.json({ body: result });
});

// 7. Submit puzzle answer
router.post('/api/easter_event/puzzle', async (req, res) => {
    const { user_id, puzzle_id, answer } = req.body;
    const result = await EasterEventService.submitPuzzleAnswer(user_id, puzzle_id, answer);
    res.json({ body: result });
});

// 8. Safety actions (acknowledge or report hazard)
router.post('/api/easter_event/safety', async (req, res) => {
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
});

// 9. Session management (restart or reset spawn location)
router.post('/api/easter_event/session', async (req, res) => {
    const { user_id, action, lat, lng } = req.body;

    if (action === 'restart') {
        await SessionService.clearUniversalSession(user_id, 'EASTER_EVENT');
        return res.json({ body: { ok: true, message: "Easter Event game restarted" } });
    }

    if (action === 'reset-spawn') {
        if (!lat || !lng) {
            return res.status(400).json({ ok: false, message: "lat and lng required for reset-spawn" });
        }
        const result = await EasterEventService.resetSpawnLocation(user_id, parseFloat(lat), parseFloat(lng));
        return res.json({ body: result });
    }

    res.status(400).json({ ok: false, message: "Invalid action. Use 'restart' or 'reset-spawn'" });
});

export default router;
