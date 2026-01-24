import {
    EasterEventSession,
    EasterEgg,
    CollectedEgg,
    StoryChapter,
    Puzzle,
    MissionUpdate,
    EncodedClue,
    EncodedCharacter
} from '../types/EasterEventTypes.js';
import { EggHuntQuestion } from '../types/UniversalGameTypes.js';
import { SessionService } from './SessionService.js';
import { GeoService } from './GeoService.js';
import { EASTER_EVENT_CONFIG } from '../data/easter_event/config.js';
import { STORY_CHAPTERS } from '../data/easter_event/chapters.js';
import { PUZZLES } from '../data/easter_event/puzzles.js';
import { MISSION_UPDATES } from '../data/easter_event/mission_updates.js';
import { EggHuntQuestions } from '../data/universal/egg_hunt_questions.js';

export class EasterEventService {
    // ===== Session Management =====

    static async startOrResumeGame(userId: string, lat: number, lng: number): Promise<EasterEventSession> {
        let session = await SessionService.getUniversalSession(userId, 'EASTER_EVENT') as EasterEventSession;

        if (!session) {
            session = this.createNewSession(userId, lat, lng);
            this.spawnNewEgg(session, lat, lng);
            await SessionService.saveUniversalSession(session);
        } else {
            // Check egg expiration and respawn if needed
            if (session.currentEgg && session.currentEgg.expireTime < Date.now()) {
                console.log(`[EasterEvent] Egg expired for user ${userId}, respawning.`);
                this.spawnNewEgg(session, session.startPosition.lat, session.startPosition.lng);
                await SessionService.saveUniversalSession(session);
            }
        }

        return session;
    }

    private static createNewSession(userId: string, lat: number, lng: number): EasterEventSession {
        return {
            userId,
            gameType: 'EASTER_EVENT',
            startTime: Date.now(),
            startPosition: { lat, lng },
            lastPosition: { lat, lng },
            safetyVerified: false,
            currentLevel: 1,
            score: 0,
            history: [],
            dailyEggs: {},
            codexMapping: this.generateRandomCodex(),
            unlockedLetters: this.initializeUnlockedLetters(),
            currentEgg: null,
            puzzlesSolved: [],
            totalEggsCollected: 0,
            uniqueLettersFound: 0,
            goldenEggCollected: false
        };
    }

    private static initializeUnlockedLetters(): Record<string, boolean> {
        const result: Record<string, boolean> = {};
        EASTER_EVENT_CONFIG.ALPHABET.forEach(letter => {
            result[letter] = false;
        });
        return result;
    }

    private static generateRandomCodex(): Record<string, string> {
        const shuffledAlpha = [...EASTER_EVENT_CONFIG.ALPHABET].sort(() => Math.random() - 0.5);
        const mapping: Record<string, string> = {};
        EASTER_EVENT_CONFIG.SYMBOLS.forEach((sym, i) => {
            mapping[sym] = shuffledAlpha[i];
        });
        return mapping;
    }

    // ===== Daily Egg Management =====

    static getEggsCollectedToday(session: EasterEventSession): number {
        const today = this.getTodayDateString();
        return session.dailyEggs[today]?.length || 0;
    }

    static canCollectMoreEggsToday(session: EasterEventSession): boolean {
        return this.getEggsCollectedToday(session) < EASTER_EVENT_CONFIG.DAILY_EGG_LIMIT;
    }

    private static getTodayDateString(): string {
        return new Date().toISOString().split('T')[0];
    }

    // ===== Weighted Random Letter Selection =====

    static selectRandomLetter(): string {
        const weights = EASTER_EVENT_CONFIG.LETTER_WEIGHTS;
        const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;

        for (const [letter, weight] of Object.entries(weights)) {
            random -= weight;
            if (random <= 0) return letter;
        }

        return 'E'; // Fallback to common letter
    }

    // ===== Egg Spawning =====

    static spawnNewEgg(session: EasterEventSession, lat: number, lng: number): void {
        // Check if golden egg day and not collected
        if (this.isGoldenEggAvailable() && !session.goldenEggCollected) {
            this.spawnGoldenEgg(session, lat, lng);
            return;
        }

        // Check daily limit
        if (!this.canCollectMoreEggsToday(session)) {
            session.currentEgg = null;
            return;
        }

        const assignedLetter = this.selectRandomLetter();
        const pos = this.getRandomPointNearby(
            lat, lng,
            EASTER_EVENT_CONFIG.SPAWN_RADIUS_METERS / 1000,
            EASTER_EVENT_CONFIG.MIN_SPAWN_DISTANCE_METERS / 1000
        );

        // Randomly assign subject
        const subjects: Array<'MATH' | 'ENGLISH' | 'SCIENCE'> = ['MATH', 'ENGLISH', 'SCIENCE'];
        const subject = subjects[Math.floor(Math.random() * subjects.length)];

        session.currentEgg = {
            lat: pos.lat,
            lng: pos.lng,
            spawnTime: Date.now(),
            expireTime: Date.now() + (EASTER_EVENT_CONFIG.EGG_EXPIRE_MINUTES * 60 * 1000),
            assignedLetter,
            subject,
            isGoldenEgg: false
        };
    }

    private static spawnGoldenEgg(session: EasterEventSession, lat: number, lng: number): void {
        const pos = this.getRandomPointNearby(
            lat, lng,
            EASTER_EVENT_CONFIG.SPAWN_RADIUS_METERS / 1000,
            EASTER_EVENT_CONFIG.MIN_SPAWN_DISTANCE_METERS / 1000
        );

        session.currentEgg = {
            lat: pos.lat,
            lng: pos.lng,
            spawnTime: Date.now(),
            expireTime: Date.now() + (EASTER_EVENT_CONFIG.EGG_EXPIRE_MINUTES * 60 * 1000),
            assignedLetter: '', // Golden egg doesn't have a letter
            subject: 'MATH', // Not used for golden egg
            isGoldenEgg: true
        };
    }

    // ===== AWTY (Location Check) =====

    static async handleAWTY(userId: string, lat: number, lng: number): Promise<any> {
        const session = await SessionService.getUniversalSession(userId, 'EASTER_EVENT') as EasterEventSession;
        if (!session) return { ok: false, message: "No active session" };

        session.lastPosition = { lat, lng };

        // Check egg expiration and respawn if needed
        if (session.currentEgg && session.currentEgg.expireTime < Date.now()) {
            console.log(`[EasterEvent] Egg expired during AWTY for ${userId}, respawning.`);
            this.spawnNewEgg(session, session.startPosition.lat, session.startPosition.lng);
        }

        // If no egg and can collect more, spawn one
        if (!session.currentEgg && this.canCollectMoreEggsToday(session)) {
            this.spawnNewEgg(session, session.startPosition.lat, session.startPosition.lng);
        }

        // Also check golden egg availability
        if (!session.currentEgg && this.isGoldenEggAvailable() && !session.goldenEggCollected) {
            this.spawnGoldenEgg(session, session.startPosition.lat, session.startPosition.lng);
        }

        await SessionService.saveUniversalSession(session);

        if (!session.currentEgg) {
            const canCollectMore = this.canCollectMoreEggsToday(session);
            return {
                ok: true,
                arrived: false,
                message: canCollectMore
                    ? "Searching for eggs..."
                    : "You've collected all your eggs for today! Come back tomorrow!",
                session,
                dailyProgress: {
                    collected: this.getEggsCollectedToday(session),
                    max: EASTER_EVENT_CONFIG.DAILY_EGG_LIMIT
                }
            };
        }

        const dist = GeoService.getDistanceFromLatLonInMeters(
            lat, lng, session.currentEgg.lat, session.currentEgg.lng
        );

        if (dist < EASTER_EVENT_CONFIG.COLLECTION_RADIUS_METERS) {
            // User arrived at egg
            if (session.currentEgg.isGoldenEgg) {
                return {
                    ok: true,
                    arrived: true,
                    isGoldenEgg: true,
                    session
                };
            }

            // Get question for this egg (only if not already assigned)
            if (!session.currentEgg.currentQuestion) {
                const question = this.getRandomQuestion(session.currentEgg.subject);
                session.currentEgg.currentQuestion = question.question;
                session.currentEgg.currentAnswer = question.answer;
                await SessionService.saveUniversalSession(session);
            }

            return {
                ok: true,
                arrived: true,
                isGoldenEgg: false,
                session,
                task: {
                    type: 'question_single',
                    content: session.currentEgg.currentQuestion,
                    subject: session.currentEgg.subject,
                    answer: session.currentEgg.currentAnswer
                }
            };
        }

        // Not arrived yet - show distance and direction
        const bearing = GeoService.bearing(lat, lng, session.currentEgg.lat, session.currentEgg.lng);
        const direction = GeoService.degToCompass(bearing);

        return {
            ok: true,
            arrived: false,
            message: `Egg is ${Math.floor(dist)}m to the ${direction}`,
            distance: dist,
            direction,
            session,
            markers: [{
                lat: session.currentEgg.lat,
                lng: session.currentEgg.lng,
                title: session.currentEgg.isGoldenEgg ? "Golden Egg!" : "Easter Egg",
                colour: session.currentEgg.isGoldenEgg ? "gold" : this.getEggColour(session.currentEgg.subject)
            }],
            dailyProgress: {
                collected: this.getEggsCollectedToday(session),
                max: EASTER_EVENT_CONFIG.DAILY_EGG_LIMIT
            }
        };
    }

    private static getEggColour(subject: string): string {
        if (subject === 'MATH') return 'blue';
        if (subject === 'ENGLISH') return 'orange';
        if (subject === 'SCIENCE') return 'green';
        return 'pink';
    }

    private static getRandomQuestion(subject: 'MATH' | 'ENGLISH' | 'SCIENCE'): EggHuntQuestion {
        // Get all questions for this subject from levels 1-26 (not special)
        const subjectQuestions = EggHuntQuestions.filter(
            q => q.subject === subject && q.level <= 26
        );
        return subjectQuestions[Math.floor(Math.random() * subjectQuestions.length)];
    }

    // ===== Egg Collection =====

    // Called when user clicks "Collect" on the celebration popup (before question)
    // This counts the egg toward daily limit
    static async confirmArrival(userId: string): Promise<any> {
        const session = await SessionService.getUniversalSession(userId, 'EASTER_EVENT') as EasterEventSession;
        if (!session || !session.currentEgg) {
            return { ok: false, message: "No egg to collect" };
        }

        // Golden egg doesn't count toward daily limit
        if (session.currentEgg.isGoldenEgg) {
            return {
                ok: true,
                isGoldenEgg: true,
                message: "Golden egg confirmed!"
            };
        }

        // Record the collection (egg counts toward daily limit now, before question)
        const letter = session.currentEgg.assignedLetter;
        const today = this.getTodayDateString();

        if (!session.dailyEggs[today]) {
            session.dailyEggs[today] = [];
        }

        // Add placeholder entry - will be updated with result after question
        session.dailyEggs[today].push({
            letter,
            collectedAt: Date.now(),
            isDuplicate: session.unlockedLetters[letter] === true,
            lat: session.currentEgg.lat,
            lng: session.currentEgg.lng
        });

        session.totalEggsCollected++;
        await SessionService.saveUniversalSession(session);

        console.log(`[EasterEvent] User ${userId} confirmed arrival at egg, counted as collected.`);

        return {
            ok: true,
            isGoldenEgg: false,
            message: "Egg collected! Now answer the question.",
            task: {
                type: 'question_single',
                content: session.currentEgg.currentQuestion,
                subject: session.currentEgg.subject,
                answer: session.currentEgg.currentAnswer
            },
            dailyProgress: {
                collected: this.getEggsCollectedToday(session),
                max: EASTER_EVENT_CONFIG.DAILY_EGG_LIMIT
            }
        };
    }

    static async collectEgg(userId: string, answer: string): Promise<any> {
        const session = await SessionService.getUniversalSession(userId, 'EASTER_EVENT') as EasterEventSession;
        if (!session || !session.currentEgg) {
            return { ok: false, message: "No egg to collect" };
        }

        // Golden egg has special handling (no question)
        if (session.currentEgg.isGoldenEgg) {
            return this.collectGoldenEgg(userId);
        }

        // Check if question was assigned (should have been set in handleAWTY)
        if (!session.currentEgg.currentAnswer) {
            return { ok: false, message: "No question assigned to this egg" };
        }

        // Check answer (case-insensitive) against the stored answer
        const isCorrect = answer.toLowerCase().trim() === session.currentEgg.currentAnswer.toLowerCase().trim();

        // Get letter info before clearing egg
        const letter = session.currentEgg.assignedLetter;
        const isDuplicate = session.unlockedLetters[letter] === true;

        if (!isCorrect) {
            // Wrong answer - respawn egg, don't reveal letter
            // Egg is already counted (from confirmArrival), just clear and respawn
            console.log(`[EasterEvent] Wrong answer from ${userId}, respawning egg.`);
            session.currentEgg = null;
            if (this.canCollectMoreEggsToday(session)) {
                this.spawnNewEgg(session, session.startPosition.lat, session.startPosition.lng);
            }
            await SessionService.saveUniversalSession(session);

            return {
                ok: true,
                correct: false,
                message: "Incorrect! The egg flew away without revealing its letter...",
                session,
                dailyProgress: {
                    collected: this.getEggsCollectedToday(session),
                    max: EASTER_EVENT_CONFIG.DAILY_EGG_LIMIT
                }
            };
        }

        // Correct answer - reveal letter
        if (!isDuplicate) {
            session.unlockedLetters[letter] = true;
            session.uniqueLettersFound++;
        }

        // Clear current egg and spawn next if possible
        session.currentEgg = null;
        if (this.canCollectMoreEggsToday(session)) {
            this.spawnNewEgg(session, session.startPosition.lat, session.startPosition.lng);
        }

        await SessionService.saveUniversalSession(session);

        // Get the symbol for this letter
        const symbol = this.getSymbolForLetter(letter, session.codexMapping);

        return {
            ok: true,
            correct: true,
            letter,
            symbol,
            isDuplicate,
            message: isDuplicate
                ? `Oh no! We already have ${letter}!`
                : `New letter unlocked: ${letter}!`,
            session,
            dailyProgress: {
                collected: this.getEggsCollectedToday(session),
                max: EASTER_EVENT_CONFIG.DAILY_EGG_LIMIT
            }
        };
    }

    // ===== Golden Egg =====

    static isGoldenEggAvailable(): boolean {
        const eventStart = new Date(EASTER_EVENT_CONFIG.EVENT_START_DATE + 'T00:00:00Z');
        const goldenEggDay = eventStart.getTime() +
            EASTER_EVENT_CONFIG.GOLDEN_EGG.dayOffset * 24 * 60 * 60 * 1000;
        return Date.now() >= goldenEggDay;
    }

    static async collectGoldenEgg(userId: string): Promise<any> {
        const session = await SessionService.getUniversalSession(userId, 'EASTER_EVENT') as EasterEventSession;
        if (!session) return { ok: false, message: "No session" };

        if (session.goldenEggCollected) {
            return { ok: false, message: "You've already collected the Golden Egg!" };
        }

        // Mark as collected
        session.goldenEggCollected = true;
        session.currentEgg = null;

        // Spawn a regular egg if possible
        if (this.canCollectMoreEggsToday(session)) {
            this.spawnNewEgg(session, session.startPosition.lat, session.startPosition.lng);
        }

        await SessionService.saveUniversalSession(session);

        // Encode GERARDIA with player's codex
        const message = EASTER_EVENT_CONFIG.GOLDEN_EGG.message;
        const encodedMessage = this.encodeWithPartialReveal(message, session.codexMapping, session.unlockedLetters);

        return {
            ok: true,
            isGoldenEgg: true,
            message: "You found the Golden Egg!",
            goldenEggMessage: message,
            encodedMessage,
            cliffhanger: "False Foxglove... The mystery continues in Part 2!",
            session
        };
    }

    // ===== Puzzle Management =====

    // Returns the simulated "now" timestamp that respects TEST_DAY_OVERRIDE
    // Uses real time of day but on the simulated day
    private static getSimulatedNow(): number {
        if (EASTER_EVENT_CONFIG.TEST_DAY_OVERRIDE === null) {
            return Date.now();
        }

        // Get the real time of day (hours, minutes, seconds, ms)
        const realNow = new Date();
        const hoursIntoDay = realNow.getHours();
        const minutesIntoHour = realNow.getMinutes();
        const secondsIntoMinute = realNow.getSeconds();
        const msIntoSecond = realNow.getMilliseconds();

        // Calculate ms into the day
        const msIntoDay = (hoursIntoDay * 60 * 60 * 1000) +
            (minutesIntoHour * 60 * 1000) +
            (secondsIntoMinute * 1000) +
            msIntoSecond;

        // Return event start + simulated days + real time of day
        const eventStart = new Date(EASTER_EVENT_CONFIG.EVENT_START_DATE + 'T00:00:00');
        return eventStart.getTime() +
            (EASTER_EVENT_CONFIG.TEST_DAY_OVERRIDE * 24 * 60 * 60 * 1000) +
            msIntoDay;
    }

    // Helper to calculate puzzle start time (5pm on the puzzle's start day)
    // Returns timestamp relative to event start (works with both real and simulated time)
    private static getPuzzleStartTime(puzzleStartDayOffset: number): number {
        const eventStart = new Date(EASTER_EVENT_CONFIG.EVENT_START_DATE + 'T00:00:00');
        const startHour = EASTER_EVENT_CONFIG.PUZZLE_START_HOUR || 17;
        return eventStart.getTime() +
            (puzzleStartDayOffset * 24 + startHour) * 60 * 60 * 1000;
    }

    static getActivePuzzle(): Puzzle | null {
        const now = this.getSimulatedNow();

        for (const puzzle of PUZZLES) {
            const startTime = this.getPuzzleStartTime(puzzle.startDayOffset);
            const endTime = startTime + puzzle.durationHours * 60 * 60 * 1000;

            if (now >= startTime && now < endTime) {
                return {
                    ...puzzle,
                    // Add computed fields
                } as Puzzle & { startTime: number; endTime: number; timeRemaining: number };
            }
        }

        return null;
    }

    static async getPuzzleStatus(userId: string): Promise<any> {
        const session = await SessionService.getUniversalSession(userId, 'EASTER_EVENT') as EasterEventSession;
        const activePuzzle = this.getActivePuzzle();
        const now = this.getSimulatedNow();

        if (!activePuzzle) {
            // Find next puzzle
            for (const puzzle of PUZZLES) {
                const startTime = this.getPuzzleStartTime(puzzle.startDayOffset);
                if (startTime > now) {
                    return {
                        active: false,
                        nextPuzzleIn: startTime - now,
                        nextPuzzleAt: startTime,
                        nextPuzzleTitle: puzzle.title,
                        message: "Next puzzle coming soon!"
                    };
                }
            }

            return {
                active: false,
                message: "All puzzles completed!"
            };
        }

        const startTime = this.getPuzzleStartTime(activePuzzle.startDayOffset);
        const endTime = startTime + activePuzzle.durationHours * 60 * 60 * 1000;

        const alreadySolved = session?.puzzlesSolved.some(p => p.puzzleId === activePuzzle.id);

        // Find next puzzle for countdown after current one ends
        let nextPuzzleAt = null;
        let nextPuzzleTitle = null;
        for (const puzzle of PUZZLES) {
            const puzzleStart = this.getPuzzleStartTime(puzzle.startDayOffset);
            if (puzzleStart > endTime || (puzzleStart > startTime && puzzle.id !== activePuzzle.id)) {
                nextPuzzleAt = puzzleStart;
                nextPuzzleTitle = puzzle.title;
                break;
            }
        }

        return {
            active: true,
            puzzle: {
                id: activePuzzle.id,
                title: activePuzzle.title,
                image: activePuzzle.image,
                hint: activePuzzle.hint
            },
            startTime,
            endTime,
            timeRemaining: endTime - now,
            solved: alreadySolved,
            nextPuzzleIn: alreadySolved ? (nextPuzzleAt ? nextPuzzleAt - now : null) : null,
            nextPuzzleAt: alreadySolved ? nextPuzzleAt : null,
            nextPuzzleTitle: alreadySolved ? nextPuzzleTitle : null
        };
    }

    static async submitPuzzleAnswer(userId: string, puzzleId: number, answer: string): Promise<any> {
        const session = await SessionService.getUniversalSession(userId, 'EASTER_EVENT') as EasterEventSession;
        if (!session) return { ok: false, message: "No session" };

        const puzzle = PUZZLES.find(p => p.id === puzzleId);
        if (!puzzle) return { ok: false, message: "Puzzle not found" };

        // Check if already solved
        if (session.puzzlesSolved.some(p => p.puzzleId === puzzleId)) {
            return { ok: false, message: "You've already solved this puzzle!" };
        }

        // Check if puzzle is active (use simulated time for testing)
        const now = this.getSimulatedNow();
        const startTime = this.getPuzzleStartTime(puzzle.startDayOffset);
        const endTime = startTime + puzzle.durationHours * 60 * 60 * 1000;

        if (now < startTime || now >= endTime) {
            return { ok: false, message: "This puzzle is not currently active" };
        }

        // Check answer (case-insensitive, unlimited guesses)
        const isCorrect = answer.toLowerCase().trim() === puzzle.answer.toLowerCase().trim();

        if (!isCorrect) {
            return {
                ok: true,
                correct: false,
                message: "Incorrect answer. Try again!"
            };
        }

        // Correct! Award letters
        session.puzzlesSolved.push({
            puzzleId,
            solvedAt: Date.now(),
            answer
        });

        const awardedLetters: string[] = [];
        puzzle.rewardLetters.forEach(letter => {
            if (!session.unlockedLetters[letter]) {
                session.unlockedLetters[letter] = true;
                session.uniqueLettersFound++;
                awardedLetters.push(letter);
            }
        });

        await SessionService.saveUniversalSession(session);

        // Get symbols for awarded letters
        const awardedSymbols = awardedLetters.map(letter => ({
            letter,
            symbol: this.getSymbolForLetter(letter, session.codexMapping)
        }));

        return {
            ok: true,
            correct: true,
            message: `Correct! You've unlocked: ${awardedLetters.join(', ')}`,
            awardedLetters,
            awardedSymbols,
            session
        };
    }

    // ===== Chapter Management =====

    static getAvailableChapters(): StoryChapter[] {
        const daysSinceStart = this.getDaysSinceEventStart();
        return STORY_CHAPTERS.filter(ch => ch.dayOffset <= daysSinceStart);
    }

    static getChapterContent(chapterId: number): any {
        const chapter = STORY_CHAPTERS.find(ch => ch.id === chapterId);
        if (!chapter) return null;

        const available = this.getAvailableChapters();
        const isUnlocked = available.some(ch => ch.id === chapterId);

        if (!isUnlocked) {
            const eventStart = new Date(EASTER_EVENT_CONFIG.EVENT_START_DATE + 'T00:00:00Z');
            const unlockDate = new Date(eventStart.getTime() +
                chapter.dayOffset * 24 * 60 * 60 * 1000);

            return {
                locked: true,
                unlocksAt: unlockDate.toISOString(),
                unlocksIn: unlockDate.getTime() - Date.now()
            };
        }

        return { ...chapter, locked: false };
    }

    // ===== Mission Updates =====

    static getMissionUpdates(): MissionUpdate[] {
        const daysSinceStart = this.getDaysSinceEventStart();
        const hoursSinceStart = this.getHoursSinceEventStart();

        return MISSION_UPDATES.filter(update => {
            // Check day requirement
            if (update.dayOffset > daysSinceStart) return false;

            // Check hour requirement if on the same day
            if (update.dayOffset === daysSinceStart && update.hourOffset) {
                const hoursIntoDay = hoursSinceStart - (daysSinceStart * 24);
                if (hoursIntoDay < update.hourOffset) return false;
            }

            return true;
        }).reverse(); // Most recent first
    }

    // ===== Clues =====

    static async getClues(userId: string): Promise<EncodedClue[]> {
        const session = await SessionService.getUniversalSession(userId, 'EASTER_EVENT') as EasterEventSession;
        if (!session) return [];

        const daysSinceStart = this.getDaysSinceEventStart();

        // Get revealed clues based on day
        const revealedClues = EASTER_EVENT_CONFIG.CLUES.filter(
            clue => clue.revealDayOffset <= daysSinceStart
        );

        // Add GERARDIA if golden egg collected
        const allClues = [...revealedClues];
        if (session.goldenEggCollected) {
            allClues.push({ text: EASTER_EVENT_CONFIG.GOLDEN_EGG.message, revealDayOffset: -1 });
        }

        return allClues.map(clue => ({
            text: clue.text,
            encoded: this.encodeWithPartialReveal(clue.text, session.codexMapping, session.unlockedLetters),
            fullyDecoded: this.isFullyDecoded(clue.text, session.unlockedLetters)
        }));
    }

    private static isFullyDecoded(text: string, unlockedLetters: Record<string, boolean>): boolean {
        return text.split('').every(char => {
            if (char === ' ') return true;
            return unlockedLetters[char.toUpperCase()] === true;
        });
    }

    // ===== Codex Encoding =====

    private static encodeWithPartialReveal(
        text: string,
        codexMapping: Record<string, string>,
        unlockedLetters: Record<string, boolean>
    ): EncodedCharacter[] {
        // Reverse mapping: letter -> symbol
        const letterToSymbol: Record<string, string> = {};
        Object.entries(codexMapping).forEach(([sym, letter]) => {
            letterToSymbol[letter] = sym;
        });

        return text.split('').map(char => {
            if (char === ' ') {
                return { char: ' ', symbol: ' ', revealed: true };
            }

            const upperChar = char.toUpperCase();
            const symbol = letterToSymbol[upperChar] || char;
            const revealed = unlockedLetters[upperChar] === true;

            return {
                char: upperChar,
                symbol,
                revealed
            };
        });
    }

    private static getSymbolForLetter(letter: string, codexMapping: Record<string, string>): string {
        for (const [symbol, mappedLetter] of Object.entries(codexMapping)) {
            if (mappedLetter === letter.toUpperCase()) {
                return symbol;
            }
        }
        return '?';
    }

    // ===== Game Screen Data =====

    static async getGameScreenData(userId: string): Promise<any> {
        const session = await SessionService.getUniversalSession(userId, 'EASTER_EVENT') as EasterEventSession;
        const puzzleStatus = await this.getPuzzleStatus(userId);
        const clues = session ? await this.getClues(userId) : [];

        return {
            session: session || null,
            chapters: STORY_CHAPTERS.map(ch => ({
                id: ch.id,
                title: ch.title,
                locked: ch.dayOffset > this.getDaysSinceEventStart(),
                dayOffset: ch.dayOffset
            })),
            availableChapters: this.getAvailableChapters().map(ch => ch.id),
            puzzleStatus,
            missionUpdates: this.getMissionUpdates(),
            clues,
            goldenEggAvailable: this.isGoldenEggAvailable(),
            goldenEggCollected: session?.goldenEggCollected || false,
            dailyProgress: session ? {
                collected: this.getEggsCollectedToday(session),
                max: EASTER_EVENT_CONFIG.DAILY_EGG_LIMIT
            } : null,
            codex: session ? this.getCodexDisplay(session) : null
        };
    }

    private static getCodexDisplay(session: EasterEventSession): any {
        return EASTER_EVENT_CONFIG.ALPHABET.map(letter => {
            const unlocked = session.unlockedLetters[letter];
            const symbol = this.getSymbolForLetter(letter, session.codexMapping);
            return {
                letter,
                symbol: unlocked ? symbol : '🔒',
                unlocked
            };
        });
    }

    // ===== Safety =====

    static async acknowledgeSafety(userId: string): Promise<any> {
        const session = await SessionService.getUniversalSession(userId, 'EASTER_EVENT') as EasterEventSession;
        if (!session) return { ok: false, message: "No active session" };

        session.safetyVerified = true;
        await SessionService.saveUniversalSession(session);

        return { ok: true, message: "Safety acknowledged", session };
    }

    static async reportHazard(userId: string): Promise<any> {
        const session = await SessionService.getUniversalSession(userId, 'EASTER_EVENT') as EasterEventSession;
        if (!session) return { ok: false, message: "No active session" };

        console.log(`[EasterEvent] Hazard reported by ${userId}, respawning egg.`);

        this.spawnNewEgg(session, session.startPosition.lat, session.startPosition.lng);
        await SessionService.saveUniversalSession(session);

        return { ok: true, message: "Egg respawned", session };
    }

    static async getSpawnRadius(userId: string): Promise<any> {
        const session = await SessionService.getUniversalSession(userId, 'EASTER_EVENT') as EasterEventSession;
        if (!session) return { ok: false, message: "No active session" };

        return {
            ok: true,
            center: session.startPosition,
            radiusMeters: EASTER_EVENT_CONFIG.SPAWN_RADIUS_METERS
        };
    }

    static async resetSpawnLocation(userId: string, lat: number, lng: number): Promise<any> {
        const session = await SessionService.getUniversalSession(userId, 'EASTER_EVENT') as EasterEventSession;
        if (!session) return { ok: false, message: "No active session" };

        session.startPosition = { lat, lng };
        session.safetyVerified = false; // Reset safety verification when spawn changes

        // Respawn egg at new location
        this.spawnNewEgg(session, lat, lng);
        await SessionService.saveUniversalSession(session);

        return { ok: true, message: "Spawn location updated", session };
    }

    static async restartGame(userId: string): Promise<any> {
        await SessionService.clearUniversalSession(userId, 'EASTER_EVENT');
        return { ok: true, message: "Game reset" };
    }

    // ===== Utility Methods =====

    private static getDaysSinceEventStart(): number {
        // TEST MODE: Allow day override for testing
        if (EASTER_EVENT_CONFIG.TEST_DAY_OVERRIDE !== null) {
            return EASTER_EVENT_CONFIG.TEST_DAY_OVERRIDE;
        }

        const eventStart = new Date(EASTER_EVENT_CONFIG.EVENT_START_DATE + 'T00:00:00Z');
        const now = new Date();
        return Math.floor((now.getTime() - eventStart.getTime()) / (1000 * 60 * 60 * 24));
    }

    private static getHoursSinceEventStart(): number {
        // TEST MODE: If day is overridden, return hours as if it's noon on that day
        if (EASTER_EVENT_CONFIG.TEST_DAY_OVERRIDE !== null) {
            return EASTER_EVENT_CONFIG.TEST_DAY_OVERRIDE * 24 + 12;
        }

        const eventStart = new Date(EASTER_EVENT_CONFIG.EVENT_START_DATE + 'T00:00:00Z');
        const now = new Date();
        return Math.floor((now.getTime() - eventStart.getTime()) / (1000 * 60 * 60));
    }

    private static getRandomPointNearby(
        lat: number,
        lng: number,
        radiusKm: number,
        minDistanceKm: number = 0.1
    ): { lat: number; lng: number } {
        let attempts = 0;
        let point;

        do {
            const r = radiusKm / 111.32; // rough lat conversion
            const u = Math.random();
            const v = Math.random();
            const w = r * Math.sqrt(u);
            const t = 2 * Math.PI * v;
            const dx = w * Math.cos(t);
            const dy = w * Math.sin(t);

            point = {
                lat: lat + dy,
                lng: lng + dx / Math.cos(lat * Math.PI / 180)
            };

            const distance = GeoService.getDistanceFromLatLonInMeters(lat, lng, point.lat, point.lng);

            if (distance >= minDistanceKm * 1000) {
                break;
            }

            attempts++;
        } while (attempts < 10);

        return point!;
    }
}
