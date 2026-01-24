import { Router } from 'express';
import { TrailService } from '../services/TrailService';
import { GameEngineService } from '../services/GameEngineService';
import { SessionService } from '../services/SessionService';
import { GameConfigService } from '../services/GameConfigService';

const router = Router();

// Game Config API
router.get('/api/config/games', async (req, res) => {
    const config = await GameConfigService.getAll();
    res.json({ body: { ok: true, config } });
});

router.get('/api/config/featured', async (req, res) => {
    const featured = await GameConfigService.getFeatured();
    res.json({ body: { ok: true, featured } });
});

// Trails API
router.get('/api/trails/list', async (req, res) => {
    res.set('Cache-Control', 'no-store');
    const { lat, lng, user_id } = req.query;
    const trails = await TrailService.getTrailSummaries(
        lat ? parseFloat(lat as string) : undefined,
        lng ? parseFloat(lng as string) : undefined,
        user_id as string
    );
    res.json(trails);
});

router.post('/api/play', async (req, res) => {
    const { trail_ref, user_id } = req.body;
    if (!trail_ref || !user_id) {
        return res.status(400).json({ ok: false, message: "Missing params" });
    }

    const trail = TrailService.getResolvedTrail(trail_ref);
    if (!trail) {
        return res.status(404).json({ ok: false, message: "Trail not found" });
    }

    let session = await SessionService.getSession(user_id, trail_ref);

    // If it's a completely new session (task -1), init it
    if (session.task === -1) {
        session.playStart = Date.now();
        await SessionService.saveSession(session);
    }

    if (session.task >= 0) {
        const stepIndex = Math.floor(session.task / 100);
        const taskIndex = session.task % 100;
        const step = (trail as any).steps[stepIndex];
        const task = step ? step.tasks[taskIndex] : null;
        if (task) {
            return res.json({ body: { ok: true, task } });
        }
    }

    // Default MapTask
    const visibleSteps = (trail as any).steps.filter((s: any) => !s.hidden && s.location && s.location.lat);
    const mapTask = {
        id: -1,
        type: 'map',
        content: trail.description || (trail.steps[0]?.name + " - Go here!"),
        required: false,
        markers: visibleSteps.map((s: any) => ({
            lat: s.location.lat,
            lng: s.location.lng,
            title: s.name,
            subtitle: "Go here",
            colour: 'red',
            status: 'active'
        }))
    };

    res.json({ body: { ok: true, task: mapTask } });
});

router.post('/api/awty', async (req, res) => {
    const { user_id, trail_ref, lat, lng, accuracy, task_id } = req.body;
    const result = await GameEngineService.handleAWTY(user_id, trail_ref, parseFloat(lat), parseFloat(lng), parseFloat(accuracy), task_id);
    res.json({ body: result });
});

router.post('/api/next', async (req, res) => {
    const { user_id, trail_ref, answer } = req.body;
    const result = await GameEngineService.handleNext(user_id, trail_ref, answer);
    res.json({ body: result });
});

router.post('/api/restart', async (req, res) => {
    const { user_id, trail_ref } = req.body;
    const result = await GameEngineService.handleRestart(user_id, trail_ref);
    res.json({ body: result });
});

router.get('/api/session', async (req, res) => {
    const { user_id, trail_ref } = req.query;
    const session = await SessionService.getSession(user_id as string, trail_ref as string);
    res.json({ body: { ok: true, session } });
});

export default router;
