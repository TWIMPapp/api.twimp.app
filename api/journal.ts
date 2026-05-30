import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, cors } from './_utils';
import { SessionService } from '../src/services/SessionService';
import { TrailService } from '../src/services/TrailService';

// Player's evidence log. Returns the ordered list of `information` tasks the
// player has actually seen — every info task in every step they've activated,
// up to and including their current task position in the current step.
//
// Excluded: map tasks (navigation noise), question tasks (the player should
// re-decide at the synthesis step, not just re-read what they already chose),
// and the finish task (it's the reward, not evidence).
//
// Used by the in-game JournalDialog so players can swipe back through clues
// when working out who did it.
export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (handleOptions(req, res)) return;
    cors(res);

    if (req.method !== 'GET') {
        return res.status(405).json({ ok: false, message: 'Method not allowed' });
    }

    const ref = (req.query.trail_ref || req.query.game_ref) as string | undefined;
    const userId = req.query.user_id as string | undefined;
    if (!ref || !userId) {
        return res.json([]);
    }

    const session = await SessionService.getSession(userId, ref);
    const trail = await TrailService.getResolvedTrailAsync(ref) || TrailService.getResolvedTrail(ref);
    if (!trail || !session?.path) {
        return res.json([]);
    }

    const currentStep = Math.floor(session.task / 100);
    const currentTaskIdx = session.task % 100;
    const visited = session.path
        .split('|')
        .filter(Boolean)
        .map((s: string) => parseInt(s, 10));

    const tasks: any[] = [];
    for (const idx of visited) {
        const step = (trail as any).steps[idx];
        if (!step?.tasks) continue;
        const limit = idx === currentStep
            ? Math.min(currentTaskIdx + 1, step.tasks.length)
            : step.tasks.length;
        for (let i = 0; i < limit; i++) {
            const t = step.tasks[i];
            if (!t || t.type !== 'information') continue;
            const { on_arrival, on_search, on_answer, ...clean } = t;
            tasks.push(clean);
        }
    }

    res.json(tasks);
}
