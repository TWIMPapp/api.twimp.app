import { Router } from 'express';
import { EasterEventService } from '../services/EasterEventService';
import { SessionService } from '../services/SessionService';

const router = Router();

// Easter Event API
router.post('/api/easter_event/start', async (req, res) => {
    const { user_id, lat, lng } = req.body;
    const result = await EasterEventService.startOrResumeGame(user_id, parseFloat(lat), parseFloat(lng));
    res.json({ body: result });
});

router.post('/api/easter_event/awty', async (req, res) => {
    const { user_id, lat, lng } = req.body;
    const result = await EasterEventService.handleAWTY(user_id, parseFloat(lat), parseFloat(lng));
    res.json({ body: result });
});

router.post('/api/easter_event/confirm-arrival', async (req, res) => {
    const { user_id } = req.body;
    const result = await EasterEventService.confirmArrival(user_id);
    res.json({ body: result });
});

router.post('/api/easter_event/collect', async (req, res) => {
    const { user_id, answer } = req.body;
    const result = await EasterEventService.collectEgg(user_id, answer);
    res.json({ body: result });
});

router.post('/api/easter_event/collect-golden', async (req, res) => {
    const { user_id } = req.body;
    const result = await EasterEventService.collectGoldenEgg(user_id);
    res.json({ body: result });
});

router.get('/api/easter_event/game-screen', async (req, res) => {
    const { user_id } = req.query;
    const result = await EasterEventService.getGameScreenData(user_id as string);
    res.json({ body: result });
});

router.get('/api/easter_event/chapter/:id', (req, res) => {
    const chapterId = parseInt(req.params.id);
    const result = EasterEventService.getChapterContent(chapterId);
    res.json({ body: result });
});

router.get('/api/easter_event/puzzle', async (req, res) => {
    const { user_id } = req.query;
    const result = await EasterEventService.getPuzzleStatus(user_id as string);
    res.json({ body: result });
});

router.post('/api/easter_event/puzzle/submit', async (req, res) => {
    const { user_id, puzzle_id, answer } = req.body;
    const result = await EasterEventService.submitPuzzleAnswer(user_id, puzzle_id, answer);
    res.json({ body: result });
});

router.get('/api/easter_event/missions', (req, res) => {
    const result = EasterEventService.getMissionUpdates();
    res.json({ body: result });
});

router.get('/api/easter_event/clues', async (req, res) => {
    const { user_id } = req.query;
    const result = await EasterEventService.getClues(user_id as string);
    res.json({ body: result });
});

router.post('/api/easter_event/acknowledge-safety', async (req, res) => {
    const { user_id } = req.body;
    const result = await EasterEventService.acknowledgeSafety(user_id);
    res.json({ body: result });
});

router.post('/api/easter_event/report-hazard', async (req, res) => {
    const { user_id } = req.body;
    const result = await EasterEventService.reportHazard(user_id);
    res.json({ body: result });
});

router.get('/api/easter_event/spawn-radius', async (req, res) => {
    const { user_id } = req.query;
    const result = await EasterEventService.getSpawnRadius(user_id as string);
    res.json({ body: result });
});

router.post('/api/easter_event/restart', async (req, res) => {
    const { user_id } = req.body;
    await SessionService.clearUniversalSession(user_id, 'EASTER_EVENT');
    res.json({ ok: true, message: "Easter Event game restarted" });
});

router.post('/api/easter_event/reset-spawn', async (req, res) => {
    const { user_id, lat, lng } = req.body;
    const result = await EasterEventService.resetSpawnLocation(user_id, parseFloat(lat), parseFloat(lng));
    res.json({ body: result });
});

export default router;
