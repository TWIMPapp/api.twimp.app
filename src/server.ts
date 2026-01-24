import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { Logger } from './utils/logger.js';
import { TrailService } from './services/TrailService.js';
import { GameEngineService } from './services/GameEngineService.js';
import { SessionService } from './services/SessionService.js';
import { EggHuntService } from './services/EggHuntService.js';
import { EasterEventService } from './services/EasterEventService.js';
import { GameConfigService } from './services/GameConfigService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(Logger.middleware.bind(Logger));

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', branding: 'api.twimp.app' });
});

// Game Config API
app.get('/api/config/games', async (req, res) => {
    const config = await GameConfigService.getAll();
    res.json({ body: { ok: true, config } });
});

app.get('/api/config/featured', async (req, res) => {
    const featured = await GameConfigService.getFeatured();
    res.json({ body: { ok: true, featured } });
});

// Trails API
app.get('/api/trails/list', async (req, res) => {
    res.set('Cache-Control', 'no-store');
    const { lat, lng, user_id } = req.query;
    const trails = await TrailService.getTrailSummaries(
        lat ? parseFloat(lat as string) : undefined,
        lng ? parseFloat(lng as string) : undefined,
        user_id as string
    );
    res.json(trails);
});

app.post('/api/play', async (req, res) => {
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

app.post('/api/awty', async (req, res) => {
    const { user_id, trail_ref, lat, lng, accuracy, task_id } = req.body;
    const result = await GameEngineService.handleAWTY(user_id, trail_ref, parseFloat(lat), parseFloat(lng), parseFloat(accuracy), task_id);
    res.json({ body: result });
});

app.post('/api/next', async (req, res) => {
    const { user_id, trail_ref, answer } = req.body;
    const result = await GameEngineService.handleNext(user_id, trail_ref, answer);
    res.json({ body: result });
});

app.post('/api/restart', async (req, res) => {
    const { user_id, trail_ref } = req.body;
    const result = await GameEngineService.handleRestart(user_id, trail_ref);
    res.json({ body: result });
});

app.get('/api/session', async (req, res) => {
    const { user_id, trail_ref } = req.query;
    const session = await SessionService.getSession(user_id as string, trail_ref as string);
    res.json({ body: { ok: true, session } });
});

// Universal Games API - Egg Hunt
app.post('/api/universal/egg_hunt/start', async (req, res) => {
    const { user_id, lat, lng } = req.body;
    const session = await EggHuntService.startOrResumeGame(user_id, parseFloat(lat), parseFloat(lng));
    res.json({ body: { ok: true, session } });
});

app.post('/api/universal/egg_hunt/awty', async (req, res) => {
    const { user_id, lat, lng } = req.body;
    const result = await EggHuntService.handleAWTY(user_id, parseFloat(lat), parseFloat(lng));
    res.json({ body: result });
});

app.post('/api/universal/egg_hunt/next', async (req, res) => {
    const { user_id, answer } = req.body;
    const result = await EggHuntService.handleAnswer(user_id, answer);
    res.json({ body: result });
});

app.get('/api/universal/egg_hunt/codex', async (req, res) => {
    const { user_id } = req.query;
    const session = await SessionService.getUniversalSession(user_id as string, 'EGG_HUNT') as any;
    if (session) {
        res.json({ body: { ok: true, symbolUnlocks: session.symbolUnlocks } });
    } else {
        res.status(404).json({ ok: false, message: "No session found" });
    }
});

app.post('/api/universal/reset-spawn', async (req, res) => {
    const { userId, lat, lng } = req.body;
    const session = await SessionService.getUniversalSession(userId, 'EGG_HUNT') as any;
    if (session) {
        session.startPosition = { lat, lng };
        session.safetyVerified = false; // Reset safety verification when spawn location changes
        await SessionService.saveUniversalSession(session);
        res.json({ ok: true, message: "Spawn location updated", session });
    } else {
        res.status(404).json({ ok: false, message: "No session found" });
    }
});

app.post('/api/universal/egg_hunt/restart', async (req, res) => {
    const { user_id } = req.body;
    await SessionService.clearUniversalSession(user_id, 'EGG_HUNT');
    res.json({ ok: true, message: "Game restarted" });
});

app.post('/api/universal/egg_hunt/acknowledge-safety', async (req, res) => {
    const { user_id } = req.body;
    const result = await EggHuntService.acknowledeSafety(user_id);
    res.json({ body: result });
});

app.post('/api/universal/egg_hunt/report-hazard', async (req, res) => {
    const { user_id } = req.body;
    const result = await EggHuntService.reportHazard(user_id);
    res.json({ body: result });
});

app.get('/api/universal/egg_hunt/spawn-radius', async (req, res) => {
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

// Easter Event API
app.post('/api/easter_event/start', async (req, res) => {
    const { user_id, lat, lng } = req.body;
    const result = await EasterEventService.startOrResumeGame(user_id, parseFloat(lat), parseFloat(lng));
    res.json({ body: result });
});

app.post('/api/easter_event/awty', async (req, res) => {
    const { user_id, lat, lng } = req.body;
    const result = await EasterEventService.handleAWTY(user_id, parseFloat(lat), parseFloat(lng));
    res.json({ body: result });
});

app.post('/api/easter_event/confirm-arrival', async (req, res) => {
    const { user_id } = req.body;
    const result = await EasterEventService.confirmArrival(user_id);
    res.json({ body: result });
});

app.post('/api/easter_event/collect', async (req, res) => {
    const { user_id, answer } = req.body;
    const result = await EasterEventService.collectEgg(user_id, answer);
    res.json({ body: result });
});

app.post('/api/easter_event/collect-golden', async (req, res) => {
    const { user_id } = req.body;
    const result = await EasterEventService.collectGoldenEgg(user_id);
    res.json({ body: result });
});

app.get('/api/easter_event/game-screen', async (req, res) => {
    const { user_id } = req.query;
    const result = await EasterEventService.getGameScreenData(user_id as string);
    res.json({ body: result });
});

app.get('/api/easter_event/chapter/:id', (req, res) => {
    const chapterId = parseInt(req.params.id);
    const result = EasterEventService.getChapterContent(chapterId);
    res.json({ body: result });
});

app.get('/api/easter_event/puzzle', async (req, res) => {
    const { user_id } = req.query;
    const result = await EasterEventService.getPuzzleStatus(user_id as string);
    res.json({ body: result });
});

app.post('/api/easter_event/puzzle/submit', async (req, res) => {
    const { user_id, puzzle_id, answer } = req.body;
    const result = await EasterEventService.submitPuzzleAnswer(user_id, puzzle_id, answer);
    res.json({ body: result });
});

app.get('/api/easter_event/missions', (req, res) => {
    const result = EasterEventService.getMissionUpdates();
    res.json({ body: result });
});

app.get('/api/easter_event/clues', async (req, res) => {
    const { user_id } = req.query;
    const result = await EasterEventService.getClues(user_id as string);
    res.json({ body: result });
});

app.post('/api/easter_event/acknowledge-safety', async (req, res) => {
    const { user_id } = req.body;
    const result = await EasterEventService.acknowledgeSafety(user_id);
    res.json({ body: result });
});

app.post('/api/easter_event/report-hazard', async (req, res) => {
    const { user_id } = req.body;
    const result = await EasterEventService.reportHazard(user_id);
    res.json({ body: result });
});

app.get('/api/easter_event/spawn-radius', async (req, res) => {
    const { user_id } = req.query;
    const result = await EasterEventService.getSpawnRadius(user_id as string);
    res.json({ body: result });
});

app.post('/api/easter_event/restart', async (req, res) => {
    const { user_id } = req.body;
    await SessionService.clearUniversalSession(user_id, 'EASTER_EVENT');
    res.json({ ok: true, message: "Easter Event game restarted" });
});

app.post('/api/easter_event/reset-spawn', async (req, res) => {
    const { user_id, lat, lng } = req.body;
    const result = await EasterEventService.resetSpawnLocation(user_id, parseFloat(lat), parseFloat(lng));
    res.json({ body: result });
});

app.listen(PORT, () => {
    Logger.info(`Twimp Backend (api.twimp.app) running on port ${PORT}`, 'SERVER');
});
