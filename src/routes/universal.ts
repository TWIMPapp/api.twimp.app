import { Router } from 'express';
import { EggHuntService } from '../services/EggHuntService';
import { SessionService } from '../services/SessionService';

const router = Router();

// Universal Games API - Egg Hunt
router.post('/api/universal/egg_hunt/start', async (req, res) => {
    const { user_id, lat, lng } = req.body;
    const session = await EggHuntService.startOrResumeGame(user_id, parseFloat(lat), parseFloat(lng));
    res.json({ body: { ok: true, session } });
});

router.post('/api/universal/egg_hunt/awty', async (req, res) => {
    const { user_id, lat, lng } = req.body;
    const result = await EggHuntService.handleAWTY(user_id, parseFloat(lat), parseFloat(lng));
    res.json({ body: result });
});

router.post('/api/universal/egg_hunt/next', async (req, res) => {
    const { user_id, answer } = req.body;
    const result = await EggHuntService.handleAnswer(user_id, answer);
    res.json({ body: result });
});

router.get('/api/universal/egg_hunt/codex', async (req, res) => {
    const { user_id } = req.query;
    const session = await SessionService.getUniversalSession(user_id as string, 'EGG_HUNT') as any;
    if (session) {
        res.json({ body: { ok: true, symbolUnlocks: session.symbolUnlocks } });
    } else {
        res.status(404).json({ ok: false, message: "No session found" });
    }
});

router.post('/api/universal/reset-spawn', async (req, res) => {
    const { userId, lat, lng } = req.body;
    const session = await SessionService.getUniversalSession(userId, 'EGG_HUNT') as any;
    if (session) {
        session.startPosition = { lat, lng };
        session.safetyVerified = false;
        await SessionService.saveUniversalSession(session);
        res.json({ ok: true, message: "Spawn location updated", session });
    } else {
        res.status(404).json({ ok: false, message: "No session found" });
    }
});

router.post('/api/universal/egg_hunt/restart', async (req, res) => {
    const { user_id } = req.body;
    await SessionService.clearUniversalSession(user_id, 'EGG_HUNT');
    res.json({ ok: true, message: "Game restarted" });
});

router.post('/api/universal/egg_hunt/acknowledge-safety', async (req, res) => {
    const { user_id } = req.body;
    const result = await EggHuntService.acknowledeSafety(user_id);
    res.json({ body: result });
});

router.post('/api/universal/egg_hunt/report-hazard', async (req, res) => {
    const { user_id } = req.body;
    const result = await EggHuntService.reportHazard(user_id);
    res.json({ body: result });
});

router.get('/api/universal/egg_hunt/spawn-radius', async (req, res) => {
    const { user_id } = req.query;
    const session = await SessionService.getUniversalSession(user_id as string, 'EGG_HUNT') as any;
    console.log("SPAWN RADIUS", session);
    if (session) {
        const level = session.currentLevel || 1;
        const radiusMeters = level <= 6 ? 200 : 500;
        console.log("Radius", radiusMeters);
        res.json({
            body: {
                ok: true,
                center: session.startPosition,
                radiusMeters,
                level
            }
        });
    } else {
        res.status(404).json({ ok: false, message: "No session found" });
    }
});

export default router;
