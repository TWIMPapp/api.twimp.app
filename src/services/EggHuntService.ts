import { UniversalGameSession, EggHuntQuestion } from '../types/UniversalGameTypes';
import { SessionService } from './SessionService';
import { GeoService } from './GeoService';
import { EggHuntQuestions } from '../data/universal/egg_hunt_questions';

export class EggHuntService {
    private static SYMBOLS = [
        '⚡', // lightning bolt
        '⭐', // star
        '🌙', // crescent moon
        '☀️', // sun
        '🌈', // rainbow
        '❤️', // heart
        '🔥', // fire
        '💧', // water drop
        '🌸', // cherry blossom
        '🍀', // four leaf clover
        '🦋', // butterfly
        '🐝', // bee
        '🎵', // music note
        '🎨', // artist palette
        '⚽', // soccer ball
        '🎯', // target
        '🔔', // bell
        '⚓', // anchor
        '🎪', // circus tent
        '🎭', // theater masks
        '🎸', // guitar
        '🎮', // game controller
        '🚀', // rocket
        '🏆', // trophy
        '💎', // gem
        '👑'  // crown
    ];
    private static ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    private static sharedEgg30: any = null;

    static async startOrResumeGame(userId: string, lat: number, lng: number): Promise<UniversalGameSession> {
        let session = await SessionService.getUniversalSession(userId, 'EGG_HUNT') as any;

        if (!session) {
            const codexMapping = this.generateRandomCodex();

            // Initialize symbolUnlocks with all 26 letters as locked
            const symbolUnlocks: Record<string, string> = {};
            this.ALPHABET.forEach(letter => {
                symbolUnlocks[letter] = '🔒';
            });

            session = {
                userId,
                gameType: 'EGG_HUNT',
                startTime: Date.now(),
                startPosition: { lat, lng }, // Store initial start position
                lastPosition: { lat, lng },
                currentLevel: 1,
                score: 0,
                history: [],
                codexMapping: codexMapping,
                symbolUnlocks: symbolUnlocks,
                safetyVerified: false // Parent must acknowledge safety before playing
            };
            this.spawnNextEgg(session, session.startPosition.lat, session.startPosition.lng);
            await SessionService.saveUniversalSession(session);
        } else {
            // Check for expiration and respawn if needed
            const now = Date.now();
            let needsRespawn = false;

            if (session.currentEgg && session.currentEgg.expireTime < now) {
                needsRespawn = true;
            } else if (session.currentEggs && session.currentEggs.length > 0 && session.currentEggs[0].expireTime < now) {
                needsRespawn = true;
            }

            if (needsRespawn) {
                console.log(`[EggHunt] Egg(s) expired for user ${userId}, respawning nearby.`);
                // Ensure startPosition exists (for old sessions)
                const spawnLat = session.startPosition?.lat || lat;
                const spawnLng = session.startPosition?.lng || lng;
                this.spawnNextEgg(session, spawnLat, spawnLng);
                await SessionService.saveUniversalSession(session);
            }
        }

        return session;
    }

    static async handleAWTY(userId: string, lat: number, lng: number): Promise<any> {
        console.log(`[EggHunt] AWTY check for ${userId} at ${lat}, ${lng}`);
        const session = await SessionService.getUniversalSession(userId, 'EGG_HUNT') as any;
        if (!session) return { ok: false, message: "No active session" };
        console.log(session);

        // Update last known position
        session.lastPosition = { lat, lng };
        await SessionService.saveUniversalSession(session);

        let eggs = session.currentEggs || (session.currentEgg ? [session.currentEgg] : []);

        // Check for expiration and respawn if needed
        const now = Date.now();
        let needsRespawn = false;

        if (eggs.length > 0 && eggs[0].expireTime < now) {
            needsRespawn = true;
        }

        if (needsRespawn) {
            console.log(`[EggHunt] Egg(s) expired for user ${userId} during AWTY, respawning nearby.`);
            // Use start position for respawning
            const spawnLat = session.startPosition?.lat || lat;
            const spawnLng = session.startPosition?.lng || lng;
            this.spawnNextEgg(session, spawnLat, spawnLng);
            await SessionService.saveUniversalSession(session);
            // Refresh egg list
            eggs = session.currentEggs || (session.currentEgg ? [session.currentEgg] : []);
        }

        console.log(`[EggHunt] AWTY check for ${userId} at ${lat}, ${lng}. Found ${eggs.length} eggs.`);
        eggs.forEach((egg: any, i: number) => {
            const dist = GeoService.getDistanceFromLatLonInMeters(lat, lng, egg.lat, egg.lng);
            const b = GeoService.bearing(lat, lng, egg.lat, egg.lng);
            console.log(`  - Egg ${i + 1} (${egg.subject}): dist=${dist.toFixed(1)}m, bearing=${b.toFixed(1)}°, expires in ${Math.floor((egg.expireTime - Date.now()) / 1000)}s`);
        });

        if (eggs.length === 0) return { ok: false, message: "No active eggs" };

        // Check if user is near any of the eggs (within 20m)
        const nearbyEgg = eggs.find((egg: any) => {
            const dist = GeoService.getDistanceFromLatLonInMeters(lat, lng, egg.lat, egg.lng);
            return dist < 20;
        });

        console.log("Is Near An Egg?", nearbyEgg);

        if (nearbyEgg) {
            // Important: If in Phase 2/3, choosing one egg makes it the currentEgg
            if (session.currentEggs) {
                session.currentEgg = nearbyEgg;
                session.currentEggs = null;
                await SessionService.saveUniversalSession(session);
            }

            const question = this.getQuestionForLevel(session.currentLevel, nearbyEgg.subject);

            // Special logic for Egg 27: use virtual W3W
            let content = question.question;
            if (session.currentLevel === 27) {
                const w3w = nearbyEgg.w3w || "mask.melon.mint";
                const shortestWord = w3w.split('.').sort((a: string, b: string) => a.length - b.length)[0];
                content = `Translate these symbols: ${this.translateToSymbols(shortestWord, session.codexMapping)}`;
                // Store the required answer dynamically in session for this level
                session.currentQuestionAnswer = shortestWord;
                await SessionService.saveUniversalSession(session);
            }

            return {
                ok: true,
                arrived: true,
                session, // Return updated session
                task: {
                    type: 'question_single',
                    content: content,
                    subject: nearbyEgg.subject,
                    level: session.currentLevel
                }
            };
        }

        // Show distance to closest egg
        const distances = eggs.map((egg: any) => ({
            dist: GeoService.getDistanceFromLatLonInMeters(lat, lng, egg.lat, egg.lng),
            egg
        })).sort((a: any, b: any) => a.dist - b.dist);

        const closest = distances[0];
        const b = GeoService.bearing(lat, lng, closest.egg.lat, closest.egg.lng);
        const direction = GeoService.degToCompass(b);

        return {
            ok: true,
            arrived: false,
            message: `The nearest egg is ${Math.floor(closest.dist)}m away to the ${direction}`,
            distance: closest.dist,
            direction,
            session, // Return updated session
            markers: eggs.map((e: any) => ({
                lat: e.lat,
                lng: e.lng,
                title: `Egg ${session.currentLevel} (${e.subject})`,
                colour: this.getEggColour(e.level, e.subject),
                expireTime: e.expireTime
            }))
        };
    }

    private static getEggColour(level: number, subject: string): string {
        // Levels 1-26: Color based on subject (MATH=blue, ENGLISH=orange, SCIENCE=green)
        // Levels 27-29: Red
        // Level 30: Gold
        if (level === 30) return 'gold';
        if (level >= 27) return 'red';

        if (subject === 'MATH') return 'blue';
        if (subject === 'ENGLISH') return 'orange';
        if (subject === 'SCIENCE') return 'green';

        return 'red'; // Fallback
    }

    private static translateToSymbols(word: string, mapping: Record<string, string>): string {
        // Find which symbol corresponds to each letter
        const reverseMapping: Record<string, string> = {};
        Object.entries(mapping).forEach(([sym, letter]) => {
            reverseMapping[letter.toLowerCase()] = sym; // Symbols are now emojis directly
        });

        return word.split('').map(char => reverseMapping[char.toLowerCase()] || char).join(' ');
    }

    static async handleAnswer(userId: string, answer: string): Promise<any> {
        const session = await SessionService.getUniversalSession(userId, 'EGG_HUNT') as any;
        if (!session || !session.currentEgg) return { ok: false, message: "Invalid session" };

        const question = this.getQuestionForLevel(session.currentLevel, session.currentEgg.subject);

        let correct_answer = question.answer;
        if (session.currentLevel === 27 && session.currentQuestionAnswer) {
            correct_answer = session.currentQuestionAnswer;
        }

        const isCorrect = answer.toLowerCase().trim() === correct_answer.toLowerCase().trim();

        session.history.push({
            level: session.currentLevel,
            egg: session.currentEgg,
            answer,
            success: isCorrect,
            timestamp: Date.now()
        });

        if (isCorrect) {
            session.score += 10;
        }

        // Track symbol unlocks (levels 1-26 correspond to alphabet A-Z)
        if (session.currentLevel <= 26) {
            if (!session.symbolUnlocks) {
                session.symbolUnlocks = {};
            }
            const letter = this.ALPHABET[session.currentLevel - 1];

            if (isCorrect) {
                // Find the emoji symbol for this letter in the codex
                const symbolEntry = Object.entries(session.codexMapping).find(([_, mappedLetter]) => mappedLetter === letter);
                session.symbolUnlocks[letter] = symbolEntry ? symbolEntry[0] : '🔒';
            } else {
                // Wrong answer = cross
                session.symbolUnlocks[letter] = '❌';
            }
        }

        console.log(session.symbolUnlocks);

        // Progression logic: Levels 1-26 always advance, 27+ require correct answer
        const shouldAdvance = isCorrect || session.currentLevel < 27;

        // Use start position for spawning (fallback to current egg location for old sessions)
        const spawnLat = session.startPosition?.lat || session.currentEgg.lat;
        const spawnLng = session.startPosition?.lng || session.currentEgg.lng;

        if (shouldAdvance) {
            session.currentLevel++;
            if (session.currentLevel <= 30) {
                this.spawnNextEgg(session, spawnLat, spawnLng);
            } else {
                session.currentEgg = null;
            }
        } else {
            // Wrong answer on level 27+: respawn the same level
            this.spawnNextEgg(session, spawnLat, spawnLng);
        }

        // Special logic for Egg 30: If collected, remove from global state
        if (session.currentLevel === 31 && this.sharedEgg30) {
            this.sharedEgg30 = null;
        }

        await SessionService.saveUniversalSession(session);

        return {
            ok: true,
            correct: isCorrect,
            nextLevel: session.currentLevel,
            session
        };
    }

    private static generateRandomCodex(): Record<string, string> {
        const shuffledAlpha = [...this.ALPHABET].sort(() => Math.random() - 0.5);
        const mapping: Record<string, string> = {};
        this.SYMBOLS.forEach((sym, i) => {
            mapping[sym] = shuffledAlpha[i];
        });
        return mapping;
    }

    private static spawnNextEgg(session: any, lat: number, lng: number) {
        const level = session.currentLevel;
        const radius = level === 1 ? 0.2 : 0.5;

        if (level >= 7 && level <= 26) {
            // Phase 2/3: Spawn 3 eggs (Math, English, Science)
            session.currentEgg = null;
            session.currentEggs = ['MATH', 'ENGLISH', 'SCIENCE'].map(subject => {
                const pos = this.getRandomPointNearby(lat, lng, radius);
                return {
                    level,
                    lat: pos.lat,
                    lng: pos.lng,
                    spawnTime: Date.now(),
                    expireTime: Date.now() + (30 * 60 * 1000),
                    subject
                };
            });
        } else {
            // Phase 1 or 4: Single egg
            const pos = this.getRandomPointNearby(lat, lng, radius);
            session.currentEggs = null;

            // Determine expiry time (30 mins for most eggs, 5 mins for egg 30)
            const expiryDuration = level === 30 ? (5 * 60 * 1000) : (30 * 60 * 1000);

            session.currentEgg = {
                level,
                lat: pos.lat,
                lng: pos.lng,
                spawnTime: Date.now(),
                expireTime: Date.now() + expiryDuration,
                subject: this.getSubjectForLevel(level)
            };

            if (level === 27) {
                // Virtual W3W: Generate 3 words based on location
                session.currentEgg.w3w = this.getVirtualW3W(pos.lat, pos.lng);
            }

            if (level === 30) {
                // TODO: Shared Egg 30 (requires database implementation)
                // For now, treat as regular egg until database is set up
                // if (!this.sharedEgg30 || this.sharedEgg30.expireTime < Date.now()) {
                //     this.sharedEgg30 = {
                //         ...session.currentEgg,
                //         expireTime: Date.now() + (5 * 60 * 1000), // 5 mins
                //         isShared: true
                //     };
                // }
                // session.currentEgg = this.sharedEgg30;
            }
        }
    }

    private static getVirtualW3W(lat: number, lng: number): string {
        const words = ['apple', 'banana', 'cherry', 'dog', 'elephant', 'frog', 'grape', 'house', 'igloo', 'jacket', 'kite', 'lemon', 'mouse', 'nest', 'orange', 'pear', 'queen', 'rabbit', 'snake', 'tiger', 'umbrella', 'violin', 'whale', 'xylophone', 'yacht', 'zebra'];
        // Deterministic-ish random based on coords
        const idx1 = Math.floor(Math.abs(lat * 1000)) % words.length;
        const idx2 = Math.floor(Math.abs(lng * 1000)) % words.length;
        const idx3 = (idx1 + idx2) % words.length;
        return `${words[idx1]}.${words[idx2]}.${words[idx3]}`;
    }

    private static getSubjectForLevel(level: number): string {
        if (level <= 6) {
            if ([1, 4].includes(level)) return 'MATH';
            if ([2, 5].includes(level)) return 'ENGLISH';
            return 'SCIENCE';
        }
        // Levels 7-26: User chooses subject (triplet spawns)
        // Levels 27-30: Special eggs
        if (level >= 27) {
            return 'SPECIAL';
        }
        // Fallback (shouldn't be reached for levels 7-26 as they spawn triplets)
        return 'MATH';
    }

    private static getQuestionForLevel(level: number, subject: string): EggHuntQuestion {
        return EggHuntQuestions.find(q => q.level === level && (q.subject === subject || q.subject === 'SPECIAL'))!;
    }

    private static getRandomPointNearby(lat: number, lng: number, radiusKm: number, minDistanceKm: number = 0.1) {
        // Generate random point within radius, but at least minDistanceKm away
        // This prevents eggs spawning directly on top of the user
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

    static async acknowledeSafety(userId: string): Promise<any> {
        const session = await SessionService.getUniversalSession(userId, 'EGG_HUNT') as any;
        if (!session) return { ok: false, message: "No active session" };

        session.safetyVerified = true;
        await SessionService.saveUniversalSession(session);

        return { ok: true, message: "Safety acknowledged", session };
    }

    static async reportHazard(userId: string): Promise<any> {
        const session = await SessionService.getUniversalSession(userId, 'EGG_HUNT') as any;
        if (!session) return { ok: false, message: "No active session" };

        console.log(`[EggHunt] Hazard reported by ${userId}, respawning eggs at current level ${session.currentLevel}`);

        // Respawn eggs at current level using start position
        const spawnLat = session.startPosition?.lat || session.lastPosition?.lat;
        const spawnLng = session.startPosition?.lng || session.lastPosition?.lng;

        if (spawnLat && spawnLng) {
            this.spawnNextEgg(session, spawnLat, spawnLng);
            await SessionService.saveUniversalSession(session);
        }

        return { ok: true, message: "Eggs respawned", session };
    }
}
