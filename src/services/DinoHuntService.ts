// Dino Egg Hunt Service — core game logic
// Modeled on EasterEventService pattern

import {
    DinoHuntSession, DinoEgg, CollectedDino, DinoCategoryId
} from '../types/DinoHuntTypes';
import { SessionService } from './SessionService';
import { GeoService } from './GeoService';
import { AIService } from './AIService';
import { HazardService } from './HazardService';
import {
    DINO_HUNT_CONFIG, DINO_CATEGORIES, getCategoryById,
    FAVORITE_DINO_OPTIONS, RARITY_MESSAGES, INTRO_STORY
} from '../data/dino-hunt';

export class DinoHuntService {

    // ===== /play — Start or resume game =====

    static async startOrResumeGame(userId: string, lat: number, lng: number): Promise<any> {
        let session = await SessionService.getUniversalSession(userId, 'DINO_HUNT') as DinoHuntSession | null;

        if (!session) {
            session = this.createNewSession(userId, lat, lng);
            await SessionService.saveUniversalSession(session);
        } else {
            session.lastPosition = { lat, lng };
            await SessionService.saveUniversalSession(session);
        }

        return {
            ok: true,
            session: this.sanitizeSession(session),
            categories: DINO_CATEGORIES.map(c => ({
                id: c.id, name: c.name, emoji: c.emoji, eggColor: c.eggColor
            })),
            favoriteOptions: FAVORITE_DINO_OPTIONS,
        };
    }

    private static createNewSession(userId: string, lat: number, lng: number): DinoHuntSession {
        return {
            userId,
            gameType: 'DINO_HUNT',
            startTime: Date.now(),
            startPosition: { lat, lng },
            lastPosition: { lat, lng },
            currentLevel: 0,
            score: 0,
            phase: 'setup',
            favoriteDino: '',
            eggs: [],
            categoryOrder: [],
            collectedDinos: [],
            battleStory: null,
            spawnRadiusMeters: DINO_HUNT_CONFIG.SPAWN_RADIUS_METERS,
            pendingEggIndex: null,
        };
    }

    // ===== /next action: choose-dino — Player picks favorite, eggs spawn =====

    static async chooseFavoriteDino(userId: string, dinoId: string): Promise<any> {
        const session = await this.getSession(userId);
        if (!session) return { ok: false, message: 'No active game. Start with /play first.' };
        if (session.phase !== 'setup') return { ok: false, message: 'Already past setup phase.' };

        // Validate — accept predefined options or any custom string
        const predefined = FAVORITE_DINO_OPTIONS.find(o => o.id === dinoId);
        session.favoriteDino = predefined ? predefined.name : dinoId;

        // Spawn all 10 eggs
        this.spawnAllEggs(session);
        session.phase = 'hunting';
        await SessionService.saveUniversalSession(session);

        const introStory = INTRO_STORY.replace(/\{FAVOURITE_DINO\}/g, session.favoriteDino);

        return {
            ok: true,
            phase: 'hunting',
            introStory,
            favoriteDino: session.favoriteDino,
            eggs: session.eggs,
            spawnRadius: {
                center: session.startPosition,
                radiusMeters: session.spawnRadiusMeters
            },
            session: this.sanitizeSession(session),
        };
    }

    // ===== Egg Spawning =====

    private static spawnAllEggs(session: DinoHuntSession): void {
        // Shuffle category order
        const shuffled = [...DINO_CATEGORIES].sort(() => Math.random() - 0.5);
        session.categoryOrder = shuffled.map(c => c.id);

        const { lat, lng } = session.startPosition;
        const eggs: DinoEgg[] = [];

        for (let i = 0; i < DINO_HUNT_CONFIG.TOTAL_EGGS; i++) {
            const point = this.getRandomSpawnPoint(lat, lng, eggs);
            eggs.push({
                lat: point.lat,
                lng: point.lng,
                categoryId: session.categoryOrder[i],
                eggIndex: i,
                collected: false,
            });
        }

        session.eggs = eggs;
    }

    private static getRandomSpawnPoint(
        centerLat: number,
        centerLng: number,
        existingEggs: DinoEgg[]
    ): { lat: number; lng: number } {
        const minDist = DINO_HUNT_CONFIG.MIN_SPAWN_DISTANCE_METERS;
        const maxDist = DINO_HUNT_CONFIG.SPAWN_RADIUS_METERS;

        for (let attempt = 0; attempt < 50; attempt++) {
            const angle = Math.random() * 2 * Math.PI;
            const minR = minDist / 1000;
            const maxR = maxDist / 1000;
            const distKm = Math.sqrt(Math.random() * (maxR * maxR - minR * minR) + minR * minR);

            const latOffset = (distKm * Math.cos(angle)) / 111.32;
            const lngOffset = (distKm * Math.sin(angle)) / (111.32 * Math.cos(centerLat * Math.PI / 180));

            const point = {
                lat: centerLat + latOffset,
                lng: centerLng + lngOffset,
            };

            // Verify distance from center is in range
            const distFromCenter = GeoService.getDistanceFromLatLonInMeters(
                centerLat, centerLng, point.lat, point.lng
            );
            if (distFromCenter < minDist || distFromCenter > maxDist) continue;

            // Verify minimum spacing from existing eggs
            const tooClose = existingEggs.some(egg => {
                const d = GeoService.getDistanceFromLatLonInMeters(egg.lat, egg.lng, point.lat, point.lng);
                return d < minDist;
            });
            if (tooClose) continue;

            return point;
        }

        // Fallback — just use GeoService random point if spacing fails
        const fallbackDist = minDist + Math.random() * (maxDist - minDist);
        return GeoService.getRandomPointAtDistance(centerLat, centerLng, fallbackDist);
    }

    // ===== /awty — Location check =====

    static async handleAWTY(userId: string, lat: number, lng: number): Promise<any> {
        const session = await this.getSession(userId);
        if (!session) return { ok: false, message: 'No active game.' };

        session.lastPosition = { lat, lng };

        // Only check proximity during hunting or golden_egg phases
        if (session.phase === 'hunting') {
            return this.handleHuntingAWTY(session, lat, lng);
        }

        if (session.phase === 'golden_egg') {
            return this.handleGoldenEggAWTY(session, lat, lng);
        }

        await SessionService.saveUniversalSession(session);
        return {
            ok: true,
            phase: session.phase,
            session: this.sanitizeSession(session),
        };
    }

    private static async handleHuntingAWTY(
        session: DinoHuntSession, lat: number, lng: number
    ): Promise<any> {
        const uncollectedEggs = session.eggs.filter(e => !e.collected);
        const collectionRadius = DINO_HUNT_CONFIG.COLLECTION_RADIUS_METERS;

        // Check if player is near any uncollected egg
        let arrivedEgg: DinoEgg | null = null;
        let nearestDist = Infinity;
        let nearestDirection = '';

        for (const egg of uncollectedEggs) {
            const dist = GeoService.getDistanceFromLatLonInMeters(lat, lng, egg.lat, egg.lng);
            if (dist <= collectionRadius) {
                arrivedEgg = egg;
                break;
            }
            if (dist < nearestDist) {
                nearestDist = dist;
                const bearing = GeoService.bearing(lat, lng, egg.lat, egg.lng);
                nearestDirection = GeoService.degToCompass(bearing);
            }
        }

        if (arrivedEgg) {
            // Player arrived at an egg — return the question
            const category = getCategoryById(arrivedEgg.categoryId);
            if (!category) {
                return { ok: false, message: 'Category not found' };
            }

            session.pendingEggIndex = arrivedEgg.eggIndex;
            await SessionService.saveUniversalSession(session);

            // Shuffle the answer options for display
            const shuffledOptions = [...category.question.options]
                .sort(() => Math.random() - 0.5);

            return {
                ok: true,
                arrived: true,
                phase: 'hunting',
                eggIndex: arrivedEgg.eggIndex,
                category: {
                    id: category.id,
                    name: category.name,
                    emoji: category.emoji,
                    eggColor: category.eggColor,
                },
                question: {
                    text: category.question.text,
                    options: shuffledOptions.map(o => o.label),
                    // Store the rarity mapping so answer-question can resolve it
                    _optionRarities: shuffledOptions.map(o => o.rarity),
                },
                collectedCount: session.collectedDinos.length,
                totalEggs: DINO_HUNT_CONFIG.TOTAL_EGGS,
                eggs: session.eggs,
                session: this.sanitizeSession(session),
            };
        }

        // Not arrived yet — return distance/direction hint
        await SessionService.saveUniversalSession(session);
        return {
            ok: true,
            arrived: false,
            phase: 'hunting',
            nearestDistance: Math.round(nearestDist),
            nearestDirection,
            collectedCount: session.collectedDinos.length,
            totalEggs: DINO_HUNT_CONFIG.TOTAL_EGGS,
            eggs: session.eggs,
            session: this.sanitizeSession(session),
        };
    }

    private static async handleGoldenEggAWTY(
        session: DinoHuntSession, lat: number, lng: number
    ): Promise<any> {
        const startPos = session.startPosition;
        const dist = GeoService.getDistanceFromLatLonInMeters(lat, lng, startPos.lat, startPos.lng);
        const collectionRadius = DINO_HUNT_CONFIG.COLLECTION_RADIUS_METERS;

        if (dist <= collectionRadius) {
            await SessionService.saveUniversalSession(session);
            return {
                ok: true,
                arrived: true,
                phase: 'golden_egg',
                goldenEggReady: true,
                session: this.sanitizeSession(session),
            };
        }

        const bearing = GeoService.bearing(lat, lng, startPos.lat, startPos.lng);
        await SessionService.saveUniversalSession(session);

        return {
            ok: true,
            arrived: false,
            phase: 'golden_egg',
            nearestDistance: Math.round(dist),
            nearestDirection: GeoService.degToCompass(bearing),
            goldenEgg: { lat: startPos.lat, lng: startPos.lng },
            eggs: session.eggs,
            session: this.sanitizeSession(session),
        };
    }

    // ===== /next action: answer-question =====

    static async answerQuestion(
        userId: string, answerIndex: number, optionRarities: string[]
    ): Promise<any> {
        const session = await this.getSession(userId);
        if (!session) return { ok: false, message: 'No active game.' };
        if (session.pendingEggIndex === null) {
            return { ok: false, message: 'No pending egg to answer.' };
        }

        const eggIndex = session.pendingEggIndex;
        const egg = session.eggs[eggIndex];
        if (!egg || egg.collected) {
            return { ok: false, message: 'Egg already collected or invalid.' };
        }

        const category = getCategoryById(egg.categoryId);
        if (!category) return { ok: false, message: 'Category not found.' };

        // Determine rarity from the shuffled option order
        const rarity = optionRarities[answerIndex] as 'epic' | 'rare' | 'common';
        if (!rarity) return { ok: false, message: 'Invalid answer index.' };

        const dinosaur = category.dinosaurs[rarity];
        const revealMessage = RARITY_MESSAGES[rarity];

        return {
            ok: true,
            phase: 'hunting',
            dinosaur: {
                name: dinosaur.name,
                rarity: dinosaur.rarity,
                stats: dinosaur.stats,
                total: dinosaur.total,
                categoryId: category.id,
                categoryName: category.name,
            },
            revealMessage,
            eggIndex,
            session: this.sanitizeSession(session),
        };
    }

    // ===== /next action: name-dino =====

    static async nameDino(userId: string, nickname: string, dinoData: any): Promise<any> {
        const session = await this.getSession(userId);
        if (!session) return { ok: false, message: 'No active game.' };
        if (session.pendingEggIndex === null) {
            return { ok: false, message: 'No pending dinosaur to name.' };
        }

        // Sanitize nickname
        const cleanNick = (nickname || '').trim().substring(0, DINO_HUNT_CONFIG.MAX_NICKNAME_LENGTH);
        if (!cleanNick) return { ok: false, message: 'Nickname cannot be empty.' };

        const eggIndex = session.pendingEggIndex;
        const egg = session.eggs[eggIndex];
        if (!egg) return { ok: false, message: 'Invalid egg.' };

        // Mark egg as collected
        egg.collected = true;

        // Add to collected dinos
        const collectedDino: CollectedDino = {
            name: dinoData.name,
            nickname: cleanNick,
            rarity: dinoData.rarity,
            stats: dinoData.stats,
            total: dinoData.total,
            attributes: dinoData.attributes || '',
            categoryId: dinoData.categoryId,
            categoryName: dinoData.categoryName,
            eggIndex,
            collectedAt: Date.now(),
        };
        session.collectedDinos.push(collectedDino);
        session.score += collectedDino.total;
        session.pendingEggIndex = null;

        // Check if all 10 collected — spawn golden egg
        const allCollected = session.collectedDinos.length >= DINO_HUNT_CONFIG.TOTAL_EGGS;
        if (allCollected) {
            session.phase = 'golden_egg';
        }

        await SessionService.saveUniversalSession(session);

        return {
            ok: true,
            phase: session.phase,
            collectedDino,
            collectedCount: session.collectedDinos.length,
            totalEggs: DINO_HUNT_CONFIG.TOTAL_EGGS,
            goldenEggSpawned: allCollected,
            goldenEggLocation: allCollected ? session.startPosition : null,
            eggs: session.eggs,
            session: this.sanitizeSession(session),
        };
    }

    // ===== /next action: collect-golden-egg =====

    static async collectGoldenEgg(userId: string): Promise<any> {
        const session = await this.getSession(userId);
        if (!session) return { ok: false, message: 'No active game.' };
        if (session.phase !== 'golden_egg') {
            return { ok: false, message: 'Not in golden egg phase.' };
        }

        // Generate battle story
        const story = await this.generateBattleStory(session);
        session.battleStory = story;
        session.phase = 'victory';
        await SessionService.saveUniversalSession(session);

        return {
            ok: true,
            phase: 'victory',
            battleStory: story,
            army: session.collectedDinos,
            totalScore: session.score,
            favoriteDino: session.favoriteDino,
            session: this.sanitizeSession(session),
        };
    }

    // ===== AI Battle Story Generation =====

    private static async generateBattleStory(session: DinoHuntSession): Promise<string> {
        const armyDescription = session.collectedDinos.map(d =>
            `- ${d.nickname} (${d.name}, ${d.rarity.toUpperCase()}) — Speed:${d.stats.speed} Size:${d.stats.size} Strength:${d.stats.strength} Intelligence:${d.stats.intelligence} Defence:${d.stats.defence} Aggression:${d.stats.aggression} (Total: ${d.total})  Unique attributes: ${d.attributes}`
        ).join('\n');

        const systemPrompt = `You are a storyteller for a children's dinosaur adventure game. Write exciting, fun, age-appropriate stories. Keep language playful and avoid anything scary or violent. The player always wins but make it dramatic and fun.`;

        const userPrompt = `Generate a fun, exciting battle story (200-300 words) where this dinosaur army defeats the evil Dr. Fossilus and rescues a baby ${session.favoriteDino}.

Use each dinosaur's NICKNAME throughout the story, occasionally alongside their species name (e.g Danny the Diplodocus).
First consider what makes the player's team unique.

For example,
1) Does the player have Epic dinosaurs in their team?  Make them the star
2) Does the player have two Velociraptors?  They are known for working well together.
3) Does one of their dinosaurs have a unique quality useful in a battle, an armoured head, a really long tail etc
4) Does one of their dinousaurs get a 100% score in a particular stat?  Make that stat is their superpower in the story
5) Do they have a common dinosaur that could do something funny and unexpected?

Next, decide how the team is ultimately going to win and then write the story.

The player's dinosaur army:
${armyDescription}

Make it dramatic, funny, and end with a happy rescue!`;

        const story = await AIService.generateText(systemPrompt, userPrompt, {
            maxTokens: 1024,
            temperature: 0.9,
        });

        return story || this.getFallbackStory(session);
    }

    private static getFallbackStory(session: DinoHuntSession): string {
        const names = session.collectedDinos.map(d => d.nickname);
        const epics = session.collectedDinos.filter(d => d.rarity === 'epic');
        const leader = epics[0] || session.collectedDinos[0];

        return `The moment had come. ${names.join(', ')} stood united against Dr. Fossilus and his army of mind-controlled dinosaurs.

${leader.nickname} the ${leader.name} charged forward with incredible bravery, leading the attack. The ground shook as the army advanced together.

Dr. Fossilus laughed from behind his mind-control machine. "You can't stop me!" he cried. But he hadn't counted on the teamwork of this incredible group.

${names[0]} created a distraction while ${names[1] || 'the others'} snuck around behind. ${names[2] || 'Another brave dinosaur'} used their strength to smash through the defences. One by one, each dinosaur played their part perfectly.

With a mighty effort, ${leader.nickname} crashed through the final barrier and destroyed the mind-control device. It shattered into a thousand pieces!

The baby ${session.favoriteDino} was free at last! It ran happily towards its rescuers, and all the mind-controlled dinosaurs were released from Dr. Fossilus's spell.

"Nooooo!" screamed Dr. Fossilus as he ran away, defeated.

The army of ${session.collectedDinos.length} brave dinosaurs celebrated their victory. They had saved the day — together!`;
    }

    // ===== Report unreachable egg =====

    static async reportUnreachableEgg(
        userId: string, eggIndex: number, category: string, lat: number, lng: number
    ): Promise<any> {
        const session = await this.getSession(userId);
        if (!session) return { ok: false, message: 'No active game.' };
        if (session.phase !== 'hunting') return { ok: false, message: 'Not in hunting phase.' };

        const egg = session.eggs[eggIndex];
        if (!egg) return { ok: false, message: 'Invalid egg index.' };
        if (egg.collected) return { ok: false, message: 'Egg already collected.' };

        const otherEggs = session.eggs
            .filter((e, i) => i !== eggIndex && !e.collected)
            .map(e => ({ lat: e.lat, lng: e.lng }));

        const result = await HazardService.handleReport({
            userId,
            category,
            reportedLocation: { lat: egg.lat, lng: egg.lng },
            playerPosition: { lat, lng },
            exclusionZones: session.exclusionZones || [],
            gameCenter: session.startPosition,
            spawnRadius: session.spawnRadiusMeters,
            otherPins: otherEggs,
            minSpacing: DINO_HUNT_CONFIG.MIN_SPAWN_DISTANCE_METERS,
        });

        if (!result.ok) {
            return { ok: false, message: result.message };
        }

        egg.lat = result.newLocation!.lat;
        egg.lng = result.newLocation!.lng;
        session.exclusionZones = result.updatedExclusions;
        await SessionService.saveUniversalSession(session);

        return {
            ok: true,
            message: 'Egg moved to a new location!',
            session: this.sanitizeSession(session),
        };
    }

    // ===== Helpers =====

    private static async getSession(userId: string): Promise<DinoHuntSession | null> {
        return await SessionService.getUniversalSession(userId, 'DINO_HUNT') as DinoHuntSession | null;
    }

    private static sanitizeSession(session: DinoHuntSession): any {
        return {
            phase: session.phase,
            favoriteDino: session.favoriteDino,
            eggs: session.eggs,
            collectedDinos: session.collectedDinos,
            collectedCount: session.collectedDinos.length,
            totalEggs: DINO_HUNT_CONFIG.TOTAL_EGGS,
            score: session.score,
            startPosition: session.startPosition,
            battleStory: session.battleStory,
            spawnRadiusMeters: session.spawnRadiusMeters,
        };
    }
}
