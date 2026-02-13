import { supabase, isSupabaseConfigured } from '../config/supabase';
import { SessionService } from './SessionService';
import { GeoService } from './GeoService';
import { CustomTrail, CustomPin, CustomTrailTheme, CustomTrailPlaySession } from '../types/CustomTrailTypes';
import { THEMES } from '../data/themes';
import fs from 'fs';
import path from 'path';

const CUSTOM_TRAILS_DIR = path.join(process.cwd(), 'src/data/custom_trails');
const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;
const MIN_SPACING_METERS = 50;
const MAX_PINS = 50;
const MAX_TEXT_LENGTH = 200;
const COLLECTION_RADIUS_METERS = 30;
const RANDOM_SPAWN_RADIUS_METERS = 500;
const MAX_TRAILS_PER_CREATOR = 5;
const ID_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';
const ID_LENGTH = 4;

function generateShortId(): string {
    let id = '';
    for (let i = 0; i < ID_LENGTH; i++) {
        id += ID_ALPHABET[Math.floor(Math.random() * ID_ALPHABET.length)];
    }
    return id;
}

function truncate(str: string | undefined, max: number): string | undefined {
    if (!str) return str;
    return str.length > max ? str.slice(0, max) : str;
}

export class CustomTrailService {

    // ===== File-based helpers (fallback for local dev) =====

    private static ensureDirectory() {
        if (!fs.existsSync(CUSTOM_TRAILS_DIR)) {
            fs.mkdirSync(CUSTOM_TRAILS_DIR, { recursive: true });
        }
    }

    private static getFilePath(id: string): string {
        return path.join(CUSTOM_TRAILS_DIR, `${id}.json`);
    }

    // ===== CRUD =====

    /**
     * Create a dynamic trail where pins are generated on first play
     * Used for Secret Valentine where the recipient's location determines pin placement
     */
    static async createDynamicTrail(
        creatorId: string,
        theme: CustomTrailTheme,
        name: string | undefined,
        count: number,
        icon?: string,
        successMessage?: string,
        competitive: boolean = false
    ): Promise<{ ok: boolean; trail?: CustomTrail; message?: string }> {
        if (count < 1 || count > MAX_PINS) {
            return { ok: false, message: `Count must be between 1 and ${MAX_PINS}` };
        }

        // Check 1 active trail limit per creator
        const existingActive = await this.getActiveTrailByCreator(creatorId);
        if (existingActive) {
            return { ok: false, message: 'You already have an active trail. Stop it first to create a new one.' };
        }

        // Check total trail limit per creator
        const allTrails = await this.getTrailsByCreator(creatorId);
        if (allTrails.length >= MAX_TRAILS_PER_CREATOR) {
            return { ok: false, message: `You can only create up to ${MAX_TRAILS_PER_CREATOR} games.` };
        }

        // Generate unique ID
        let id = generateShortId();
        let attempts = 0;
        while (await this.getTrail(id) !== null && attempts < 10) {
            id = generateShortId();
            attempts++;
        }
        if (attempts >= 10) {
            return { ok: false, message: 'Failed to generate unique ID. Please try again.' };
        }

        const trail: CustomTrail = {
            id,
            creatorId,
            theme,
            name: name ? truncate(name, MAX_TEXT_LENGTH) : undefined,
            startLocation: null, // Will be set on first play
            pins: [], // Will be generated on first play
            mode: 'random',
            competitive,
            globalCollectedPins: [],
            globalCollectedBy: {},
            createdAt: Date.now(),
            expiresAt: Date.now() + NINETY_DAYS_MS,
            playCount: 0,
            isActive: true,
            dynamicConfig: {
                count,
                icon: icon ? truncate(icon, 50) : undefined,
                successMessage: successMessage ? truncate(successMessage, MAX_TEXT_LENGTH) : undefined
            }
        };

        try {
            await this.saveTrail(trail);
        } catch (e: any) {
            return { ok: false, message: e.message || 'Failed to save trail' };
        }
        return { ok: true, trail };
    }

    static async createTrail(
        creatorId: string,
        theme: CustomTrailTheme,
        name: string | undefined,
        startLocation: { lat: number; lng: number },
        pins: CustomPin[],
        mode: 'random' | 'custom',
        competitive: boolean = false
    ): Promise<{ ok: boolean; trail?: CustomTrail; message?: string }> {

        // Validate pins
        if (!pins || pins.length === 0) {
            return { ok: false, message: 'At least 1 pin is required' };
        }
        if (pins.length > MAX_PINS) {
            return { ok: false, message: `Maximum ${MAX_PINS} pins allowed` };
        }

        // Validate spacing between all pins
        for (let i = 0; i < pins.length; i++) {
            for (let j = i + 1; j < pins.length; j++) {
                const dist = GeoService.getDistanceFromLatLonInMeters(
                    pins[i].lat, pins[i].lng, pins[j].lat, pins[j].lng
                );
                if (dist < MIN_SPACING_METERS) {
                    return { ok: false, message: `Pins ${i + 1} and ${j + 1} are too close (${Math.round(dist)}m). Minimum spacing is ${MIN_SPACING_METERS}m.` };
                }
            }
        }

        // Check 1 active trail limit per creator
        const existingActive = await this.getActiveTrailByCreator(creatorId);
        if (existingActive) {
            return { ok: false, message: 'You already have an active trail. Stop it first to create a new one.' };
        }

        // Check total trail limit per creator
        const allTrails = await this.getTrailsByCreator(creatorId);
        if (allTrails.length >= MAX_TRAILS_PER_CREATOR) {
            return { ok: false, message: `You can only create up to ${MAX_TRAILS_PER_CREATOR} games.` };
        }

        // Sanitise text fields
        const sanitisedPins: CustomPin[] = pins.map((pin, idx) => ({
            lat: pin.lat,
            lng: pin.lng,
            icon: pin.icon || 'pin',
            colour: pin.colour || 'red',
            visible: pin.visible !== false,
            question: truncate(pin.question, MAX_TEXT_LENGTH),
            answer: truncate(pin.answer, MAX_TEXT_LENGTH),
            successMessage: truncate(pin.successMessage, MAX_TEXT_LENGTH),
            order: idx
        }));

        // Generate unique ID
        let id = generateShortId();
        let attempts = 0;
        while (await this.getTrail(id) !== null && attempts < 10) {
            id = generateShortId();
            attempts++;
        }
        if (attempts >= 10) {
            return { ok: false, message: 'Failed to generate unique ID. Please try again.' };
        }

        const now = Date.now();
        const trail: CustomTrail = {
            id,
            creatorId,
            theme,
            name: truncate(name, MAX_TEXT_LENGTH),
            startLocation,
            pins: sanitisedPins,
            mode,
            competitive,
            globalCollectedPins: [],
            globalCollectedBy: {},
            createdAt: now,
            expiresAt: now + NINETY_DAYS_MS,
            playCount: 0,
            isActive: true
        };

        try {
            await this.saveTrail(trail);
        } catch (e: any) {
            return { ok: false, message: e.message || 'Failed to save trail' };
        }
        return { ok: true, trail };
    }

    static async getTrail(id: string): Promise<CustomTrail | null> {
        if (isSupabaseConfigured()) {
            try {
                const { data, error } = await supabase!
                    .from('custom_trails')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    console.error('Supabase getTrail error:', error);
                }
                if (data) {
                    return this.dbToTrail(data);
                }
                return null;
            } catch (e) {
                console.error('Failed to get trail from Supabase:', e);
                return null;
            }
        }

        // File-based fallback
        this.ensureDirectory();
        const filePath = this.getFilePath(id);
        if (fs.existsSync(filePath)) {
            try {
                return JSON.parse(fs.readFileSync(filePath, 'utf8'));
            } catch (e) {
                console.error(`Failed to read custom trail ${id}:`, e);
            }
        }
        return null;
    }

    static async getActiveTrail(id: string): Promise<CustomTrail | null> {
        const trail = await this.getTrail(id);
        if (!trail) return null;
        if (!trail.isActive) return null;
        if (Date.now() > trail.expiresAt) return null;
        return trail;
    }

    static async getActiveTrailByCreator(creatorId: string): Promise<CustomTrail | null> {
        if (isSupabaseConfigured()) {
            try {
                const { data, error } = await supabase!
                    .from('custom_trails')
                    .select('*')
                    .eq('creator_id', creatorId)
                    .eq('is_active', true)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    console.error('Supabase getActiveTrailByCreator error:', error);
                }
                if (data) {
                    const trail = this.dbToTrail(data);
                    if (Date.now() > trail.expiresAt) return null;
                    return trail;
                }
                return null;
            } catch (e) {
                console.error('Failed to get active trail by creator:', e);
                return null;
            }
        }

        // File-based fallback - scan directory
        this.ensureDirectory();
        const files = fs.readdirSync(CUSTOM_TRAILS_DIR).filter(f => f.endsWith('.json'));
        for (const file of files) {
            try {
                const trail: CustomTrail = JSON.parse(
                    fs.readFileSync(path.join(CUSTOM_TRAILS_DIR, file), 'utf8')
                );
                if (trail.creatorId === creatorId && trail.isActive && Date.now() <= trail.expiresAt) {
                    return trail;
                }
            } catch (e) { /* skip corrupt files */ }
        }
        return null;
    }

    static async deleteTrail(creatorId: string, trailId: string): Promise<{ ok: boolean; message: string }> {
        const trail = await this.getTrail(trailId);
        if (!trail) {
            return { ok: false, message: 'Trail not found' };
        }
        if (trail.creatorId !== creatorId) {
            return { ok: false, message: 'You can only delete your own trails' };
        }

        trail.isActive = false;
        try {
            await this.saveTrail(trail);
        } catch (e: any) {
            return { ok: false, message: e.message || 'Failed to save trail' };
        }
        return { ok: true, message: 'Trail stopped' };
    }

    static async getTrailsByCreator(creatorId: string): Promise<CustomTrail[]> {
        if (isSupabaseConfigured()) {
            try {
                const { data, error } = await supabase!
                    .from('custom_trails')
                    .select('*')
                    .eq('creator_id', creatorId)
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('Supabase getTrailsByCreator error:', error);
                    return [];
                }
                if (data && data.length > 0) {
                    return data.map(row => {
                        const trail = this.dbToTrail(row);
                        if (trail.isActive && Date.now() > trail.expiresAt) {
                            trail.isActive = false;
                        }
                        return trail;
                    });
                }
                return [];
            } catch (e) {
                console.error('Failed to get trails by creator:', e);
                return [];
            }
        }

        // File-based fallback
        this.ensureDirectory();
        const files = fs.readdirSync(CUSTOM_TRAILS_DIR).filter(f => f.endsWith('.json'));
        const trails: CustomTrail[] = [];
        for (const file of files) {
            try {
                const trail: CustomTrail = JSON.parse(
                    fs.readFileSync(path.join(CUSTOM_TRAILS_DIR, file), 'utf8')
                );
                if (trail.creatorId === creatorId) {
                    if (trail.isActive && Date.now() > trail.expiresAt) {
                        trail.isActive = false;
                    }
                    trails.push(trail);
                }
            } catch (e) { /* skip corrupt files */ }
        }
        return trails.sort((a, b) => b.createdAt - a.createdAt);
    }

    static async reactivateTrail(creatorId: string, trailId: string): Promise<{ ok: boolean; message?: string }> {
        const trail = await this.getTrail(trailId);
        if (!trail) {
            return { ok: false, message: 'Trail not found' };
        }
        if (trail.creatorId !== creatorId) {
            return { ok: false, message: 'You can only start your own trails' };
        }
        if (trail.isActive) {
            return { ok: false, message: 'Trail is already active' };
        }
        if (Date.now() > trail.expiresAt) {
            return { ok: false, message: 'Trail has expired and cannot be restarted' };
        }

        // Check no other active trail
        const existingActive = await this.getActiveTrailByCreator(creatorId);
        if (existingActive) {
            return { ok: false, message: 'You already have an active trail. Stop it first.' };
        }

        trail.isActive = true;
        try {
            await this.saveTrail(trail);
        } catch (e: any) {
            return { ok: false, message: e.message || 'Failed to save trail' };
        }
        return { ok: true };
    }

    // ===== Random pin generation =====

    static generateRandomPins(
        startLocation: { lat: number; lng: number },
        count: number,
        _hasQuestions: boolean,
        theme: CustomTrailTheme,
        spawnRadius: number = RANDOM_SPAWN_RADIUS_METERS
    ): CustomPin[] {
        const pins: CustomPin[] = [];
        const themeConfig = THEMES[theme];
        const themeIcons = themeConfig?.icons ?? [{ name: 'pin', colour: 'red' }];

        for (let i = 0; i < count; i++) {
            let lat: number, lng: number;
            let valid = false;
            let retries = 0;

            // Find a location that's at least MIN_SPACING_METERS from all existing pins
            do {
                const angle = Math.random() * 2 * Math.PI;
                const distance = MIN_SPACING_METERS + Math.random() * (spawnRadius - MIN_SPACING_METERS);

                // Offset in meters to lat/lng
                const dLat = (distance * Math.cos(angle)) / 111320;
                const dLng = (distance * Math.sin(angle)) / (111320 * Math.cos(startLocation.lat * Math.PI / 180));

                lat = startLocation.lat + dLat;
                lng = startLocation.lng + dLng;

                valid = true;
                for (const existing of pins) {
                    const dist = GeoService.getDistanceFromLatLonInMeters(lat, lng, existing.lat, existing.lng);
                    if (dist < MIN_SPACING_METERS) {
                        valid = false;
                        break;
                    }
                }
                retries++;
            } while (!valid && retries < 50);

            if (!valid) continue; // Skip if couldn't find valid position after retries

            const themeIcon = themeIcons[i % themeIcons.length];
            pins.push({
                lat,
                lng,
                icon: themeIcon.name,
                colour: themeIcon.colour,
                visible: true,
                order: i
            });
        }

        return pins;
    }

    // ===== Play session management =====

    private static getGameType(trailId: string): string {
        return `CUSTOM_TRAIL_${trailId}`;
    }

    static async startPlay(
        userId: string,
        trailId: string,
        lat: number,
        lng: number
    ): Promise<any> {
        let trail = await this.getActiveTrail(trailId);
        if (!trail) {
            return { ok: false, message: 'Trail not found or has expired' };
        }

        // Dynamic trail: generate pins on first play using player's location
        if (trail.startLocation === null && trail.pins.length === 0 && trail.dynamicConfig) {
            const { count, icon, successMessage } = trail.dynamicConfig;
            const pins = this.generateRandomPins({ lat, lng }, count, false, trail.theme);

            // Apply custom icon and message if specified
            pins.forEach(pin => {
                if (icon) pin.icon = icon;
                if (successMessage) pin.successMessage = successMessage;
            });

            trail.pins = pins;
            trail.startLocation = { lat, lng };
            delete trail.dynamicConfig; // No longer needed
            await this.saveTrail(trail);
        }

        const gameType = this.getGameType(trailId);

        // Check for existing session
        const existing = await SessionService.getUniversalSession(userId, gameType);
        if (existing) {
            const session = existing as any as CustomTrailPlaySession;
            if (!session.completed) {
                // In competitive + random, check if all pins are now globally collected
                const isCompetitiveRandom = trail.competitive && trail.mode === 'random';
                const effectiveCompleted = isCompetitiveRandom
                    ? trail.globalCollectedPins.length >= trail.pins.length
                    : session.completed;

                return {
                    ok: true,
                    resumed: true,
                    competitive: trail.competitive,
                    trail: this.getTrailForPlayer(trail, session),
                    session: {
                        currentPinIndex: session.currentPinIndex,
                        collectedPins: session.collectedPins,
                        completed: effectiveCompleted,
                        totalPins: trail.pins.length,
                        ...(isCompetitiveRandom && {
                            globalCollectedPins: trail.globalCollectedPins,
                            globalCollectedBy: trail.globalCollectedBy,
                            remainingPins: trail.pins.length - trail.globalCollectedPins.length
                        })
                    }
                };
            }
        }

        // Create new session
        const session: CustomTrailPlaySession = {
            userId,
            gameType,
            trailId,
            startTime: Date.now(),
            lastPosition: { lat, lng },
            collectedPins: [],
            currentPinIndex: 0,
            completed: false,
            currentLevel: 0,
            score: 0,
            history: []
        };

        await SessionService.saveUniversalSession(session as any);

        // Increment play count
        trail.playCount++;
        await this.saveTrail(trail);

        return {
            ok: true,
            competitive: trail.competitive,
            trail: this.getTrailForPlayer(trail, session),
            session: {
                currentPinIndex: 0,
                collectedPins: [],
                completed: false,
                totalPins: trail.pins.length,
                ...(trail.competitive && trail.mode === 'random' && {
                    globalCollectedPins: trail.globalCollectedPins,
                    globalCollectedBy: trail.globalCollectedBy,
                    remainingPins: trail.pins.length - trail.globalCollectedPins.length
                })
            }
        };
    }

    static async handleAWTY(
        userId: string,
        trailId: string,
        lat: number,
        lng: number
    ): Promise<any> {
        const trail = await this.getActiveTrail(trailId);
        if (!trail) {
            return { ok: false, message: 'Trail not found or has expired' };
        }

        const gameType = this.getGameType(trailId);
        const existing = await SessionService.getUniversalSession(userId, gameType);
        if (!existing) {
            return { ok: false, message: 'No active session. Call /play first.' };
        }

        const session = existing as any as CustomTrailPlaySession;

        // Update position
        session.lastPosition = { lat, lng };

        // ===== Competitive + Random: shared pins, first-come-first-served =====
        if (trail.competitive && trail.mode === 'random') {
            // Check if all pins globally collected
            if (trail.globalCollectedPins.length >= trail.pins.length) {
                session.completed = true;
                await SessionService.saveUniversalSession(session as any);
                return { ok: true, completed: true, message: 'All pins have been found!' };
            }

            // Find the nearest uncollected pin within range
            let nearestPin: CustomPin | null = null;
            let nearestIdx = -1;
            let nearestDist = Infinity;

            for (let i = 0; i < trail.pins.length; i++) {
                if (trail.globalCollectedPins.includes(i)) continue; // already claimed
                const pin = trail.pins[i];
                const dist = GeoService.getDistanceFromLatLonInMeters(lat, lng, pin.lat, pin.lng);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearestPin = pin;
                    nearestIdx = i;
                }
            }

            await SessionService.saveUniversalSession(session as any);

            if (nearestPin && nearestDist < COLLECTION_RADIUS_METERS) {
                if (nearestPin.question && nearestPin.answer) {
                    return {
                        ok: true,
                        arrived: true,
                        competitive: true,
                        task: {
                            type: 'question',
                            content: nearestPin.question,
                            pinIndex: nearestIdx,
                            icon: nearestPin.icon
                        },
                        session: this.buildCompetitiveSessionResponse(trail, session)
                    };
                }
                // No question - auto-collect
                const collectResult = await this.collectPin(userId, trailId, undefined, nearestIdx);
                return { ...collectResult, arrived: true };
            }

            return {
                ok: true,
                arrived: false,
                competitive: true,
                trail: this.getTrailForPlayer(trail, session),
                session: this.buildCompetitiveSessionResponse(trail, session)
            };
        }

        // ===== Non-competitive Random: personal collection, any order =====
        if (trail.mode === 'random' && !trail.competitive) {
            // Check if user has collected all pins
            if (session.collectedPins.length >= trail.pins.length) {
                session.completed = true;
                await SessionService.saveUniversalSession(session as any);
                return { ok: true, completed: true, message: 'You found all the eggs!' };
            }

            // Find the nearest uncollected pin within range
            let nearestPin: CustomPin | null = null;
            let nearestIdx = -1;
            let nearestDist = Infinity;

            for (let i = 0; i < trail.pins.length; i++) {
                if (session.collectedPins.includes(i)) continue; // already collected by this user
                const pin = trail.pins[i];
                const dist = GeoService.getDistanceFromLatLonInMeters(lat, lng, pin.lat, pin.lng);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearestPin = pin;
                    nearestIdx = i;
                }
            }

            await SessionService.saveUniversalSession(session as any);

            if (nearestPin && nearestDist < COLLECTION_RADIUS_METERS) {
                if (nearestPin.question && nearestPin.answer) {
                    return {
                        ok: true,
                        arrived: true,
                        task: {
                            type: 'question',
                            content: nearestPin.question,
                            pinIndex: nearestIdx,
                            icon: nearestPin.icon
                        },
                        session: {
                            collectedPins: session.collectedPins,
                            totalPins: trail.pins.length,
                            completed: false
                        }
                    };
                }
                // No question - auto-collect
                const collectResult = await this.collectPin(userId, trailId, undefined, nearestIdx);
                return { ...collectResult, arrived: true };
            }

            // Return status with distance to nearest pin
            return {
                ok: true,
                arrived: false,
                nearestDistance: nearestDist < Infinity ? Math.round(nearestDist) : null,
                session: {
                    collectedPins: session.collectedPins,
                    totalPins: trail.pins.length,
                    completed: false
                },
                trail: this.getTrailForPlayer(trail, session)
            };
        }

        // ===== Sequential mode =====
        if (session.completed) {
            return { ok: true, completed: true, message: 'Trail already completed!' };
        }

        const currentPin = trail.pins[session.currentPinIndex];
        if (!currentPin) {
            return { ok: false, message: 'No more pins' };
        }

        const distance = GeoService.getDistanceFromLatLonInMeters(lat, lng, currentPin.lat, currentPin.lng);
        const arrived = distance < COLLECTION_RADIUS_METERS;

        await SessionService.saveUniversalSession(session as any);

        if (arrived) {
            if (currentPin.question && currentPin.answer) {
                return {
                    ok: true,
                    arrived: true,
                    task: {
                        type: 'question',
                        content: currentPin.question,
                        pinIndex: session.currentPinIndex,
                        icon: currentPin.icon
                    },
                    session: {
                        currentPinIndex: session.currentPinIndex,
                        collectedPins: session.collectedPins,
                        completed: false,
                        totalPins: trail.pins.length
                    }
                };
            }

            const collectionResult = await this.collectPin(userId, trailId, undefined);
            return { ...collectionResult, arrived: true };
        }

        const bearing = GeoService.bearing(lat, lng, currentPin.lat, currentPin.lng);
        const direction = GeoService.degToCompass(bearing);

        return {
            ok: true,
            arrived: false,
            hint: `Head ${direction} for ${Math.round(distance)} metres`,
            distance: Math.round(distance)
        };
    }

    static async collectPin(
        userId: string,
        trailId: string,
        answer?: string,
        targetPinIndex?: number
    ): Promise<any> {
        const trail = await this.getActiveTrail(trailId);
        if (!trail) {
            return { ok: false, message: 'Trail not found or has expired' };
        }

        const gameType = this.getGameType(trailId);
        const existing = await SessionService.getUniversalSession(userId, gameType);
        if (!existing) {
            return { ok: false, message: 'No active session' };
        }

        const session = existing as any as CustomTrailPlaySession;

        // ===== Competitive + Random: shared pins, first-come-first-served =====
        if (trail.competitive && trail.mode === 'random') {
            const pinIdx = targetPinIndex ?? session.currentPinIndex;
            const pin = trail.pins[pinIdx];
            if (!pin) {
                return { ok: false, message: 'Invalid pin' };
            }

            // Check if already claimed globally
            if (trail.globalCollectedPins.includes(pinIdx)) {
                return { ok: false, message: 'Someone already found this one!' };
            }

            // Validate answer if question pin
            if (pin.question && pin.answer) {
                if (!answer) {
                    return { ok: false, message: 'Answer required' };
                }
                const correct = answer.trim().toLowerCase() === pin.answer.trim().toLowerCase();
                if (!correct) {
                    return { ok: true, correct: false, message: 'Incorrect! Try again.' };
                }
            }

            // Claim globally (first-come-first-served)
            trail.globalCollectedPins.push(pinIdx);
            trail.globalCollectedBy[pinIdx] = userId;
            await this.saveTrail(trail);

            // Update player session
            session.collectedPins.push(pinIdx);
            session.score++;

            const allCollected = trail.globalCollectedPins.length >= trail.pins.length;
            if (allCollected) {
                session.completed = true;
            }

            await SessionService.saveUniversalSession(session as any);

            return {
                ok: true,
                correct: true,
                collected: true,
                competitive: true,
                claimedBy: userId,
                successMessage: pin.successMessage || 'Found it!',
                completed: allCollected,
                trail: allCollected ? undefined : this.getTrailForPlayer(trail, session),
                session: this.buildCompetitiveSessionResponse(trail, session)
            };
        }

        // ===== Non-competitive Random: personal collection =====
        if (trail.mode === 'random' && !trail.competitive) {
            const pinIdx = targetPinIndex ?? 0;
            const pin = trail.pins[pinIdx];
            if (!pin) {
                return { ok: false, message: 'Invalid pin' };
            }

            // Check if already collected by this user
            if (session.collectedPins.includes(pinIdx)) {
                return { ok: false, message: 'You already found this one!' };
            }

            // Validate answer if question pin
            if (pin.question && pin.answer) {
                if (!answer) {
                    return { ok: false, message: 'Answer required' };
                }
                const correct = answer.trim().toLowerCase() === pin.answer.trim().toLowerCase();
                if (!correct) {
                    return { ok: true, correct: false, message: 'Incorrect! Try again.' };
                }
            }

            // Collect for this user
            session.collectedPins.push(pinIdx);
            session.score++;

            const allCollected = session.collectedPins.length >= trail.pins.length;
            if (allCollected) {
                session.completed = true;
            }

            await SessionService.saveUniversalSession(session as any);

            return {
                ok: true,
                correct: true,
                collected: true,
                successMessage: pin.successMessage || 'Found it! 🥚',
                completed: allCollected,
                session: {
                    collectedPins: session.collectedPins,
                    totalPins: trail.pins.length,
                    completed: allCollected
                },
                trail: allCollected ? undefined : this.getTrailForPlayer(trail, session)
            };
        }

        // ===== Sequential mode =====
        if (session.completed) {
            return { ok: true, completed: true, message: 'Trail already completed!' };
        }

        const currentPin = trail.pins[session.currentPinIndex];
        if (!currentPin) {
            return { ok: false, message: 'No current pin' };
        }

        // Validate answer if question pin
        if (currentPin.question && currentPin.answer) {
            if (!answer) {
                return { ok: false, message: 'Answer required' };
            }
            const correct = answer.trim().toLowerCase() === currentPin.answer.trim().toLowerCase();
            if (!correct) {
                return {
                    ok: true,
                    correct: false,
                    message: 'Incorrect! Try again.'
                };
            }
        }

        // Mark pin collected
        session.collectedPins.push(session.currentPinIndex);
        session.currentPinIndex++;
        session.score++;

        const isLastPin = session.currentPinIndex >= trail.pins.length;
        if (isLastPin) {
            session.completed = true;
        }

        await SessionService.saveUniversalSession(session as any);

        return {
            ok: true,
            correct: true,
            collected: true,
            successMessage: currentPin.successMessage || 'Found it!',
            completed: isLastPin,
            trail: isLastPin ? undefined : this.getTrailForPlayer(trail, session),
            session: {
                currentPinIndex: session.currentPinIndex,
                collectedPins: session.collectedPins,
                completed: session.completed,
                totalPins: trail.pins.length
            }
        };
    }

    // ===== Helpers =====

    /**
     * Returns trail data safe for the player.
     * Sequential: only reveals visible pins and the current target.
     * Competitive: shows all pins with global collected status.
     */
    private static getTrailForPlayer(trail: CustomTrail, session: CustomTrailPlaySession): any {
        if (trail.competitive) {
            // Competitive + Random: all pins visible, race to collect
            // Competitive + Custom: only pins marked visible by creator are shown
            const pins = trail.pins
                .filter((pin, idx) => {
                    if (trail.mode === 'random') return true; // all visible
                    // Custom mode: show if pin is visible OR already collected
                    return pin.visible || trail.globalCollectedPins.includes(idx);
                })
                .map((pin) => ({
                    lat: pin.lat,
                    lng: pin.lng,
                    icon: pin.icon,
                    colour: pin.colour,
                    order: pin.order,
                    collected: trail.globalCollectedPins.includes(pin.order),
                    collectedByYou: session.collectedPins.includes(pin.order),
                    collectedBy: trail.globalCollectedBy[pin.order] || null
                }));

            return {
                id: trail.id,
                theme: trail.theme,
                name: trail.name,
                competitive: true,
                startLocation: trail.startLocation,
                pins,
                totalPins: trail.pins.length,
                remainingPins: trail.pins.length - trail.globalCollectedPins.length
            };
        }

        // Sequential: only visible/relevant pins
        const visiblePins = trail.pins
            .filter((pin, idx) => {
                if (session.collectedPins.includes(idx)) return true;
                if (idx === session.currentPinIndex) return pin.visible;
                return pin.visible && idx > session.currentPinIndex;
            })
            .map((pin) => ({
                lat: pin.lat,
                lng: pin.lng,
                icon: pin.icon,
                colour: pin.colour,
                order: pin.order,
                collected: session.collectedPins.includes(pin.order)
            }));

        return {
            id: trail.id,
            theme: trail.theme,
            name: trail.name,
            competitive: false,
            startLocation: trail.startLocation,
            pins: visiblePins,
            totalPins: trail.pins.length
        };
    }

    private static buildCompetitiveSessionResponse(trail: CustomTrail, session: CustomTrailPlaySession): any {
        return {
            currentPinIndex: session.currentPinIndex,
            collectedPins: session.collectedPins,
            completed: trail.globalCollectedPins.length >= trail.pins.length,
            totalPins: trail.pins.length,
            globalCollectedPins: trail.globalCollectedPins,
            globalCollectedBy: trail.globalCollectedBy,
            remainingPins: trail.pins.length - trail.globalCollectedPins.length,
            yourScore: session.collectedPins.length
        };
    }

    // ===== Creator View =====

    static async getCreatorView(trailId: string, creatorId: string): Promise<any> {
        const trail = await this.getTrail(trailId);
        if (!trail) {
            return { ok: false, message: 'Trail not found' };
        }
        if (trail.creatorId !== creatorId) {
            return { ok: false, message: 'Not the creator of this trail' };
        }

        const gameType = this.getGameType(trailId);
        const sessions = await SessionService.getSessionsByGameType(gameType);

        const players = sessions.map((s: any) => ({
            userId: s.userId,
            position: s.lastPosition,
            collectedPins: s.collectedPins || [],
            completed: s.completed || false,
            score: s.score || 0,
            startTime: s.startTime
        }));

        return {
            ok: true,
            isCreatorView: true,
            trail: {
                id: trail.id,
                theme: trail.theme,
                name: trail.name,
                startLocation: trail.startLocation,
                pins: trail.pins.map((pin, idx) => ({
                    lat: pin.lat,
                    lng: pin.lng,
                    icon: pin.icon,
                    colour: pin.colour,
                    order: pin.order,
                    visible: pin.visible,
                    question: pin.question,
                    successMessage: pin.successMessage,
                    globallyCollected: trail.globalCollectedPins.includes(idx),
                    collectedBy: trail.globalCollectedBy[idx] || null
                })),
                mode: trail.mode,
                competitive: trail.competitive,
                playCount: trail.playCount,
                createdAt: trail.createdAt,
                expiresAt: trail.expiresAt,
                isActive: trail.isActive
            },
            players,
            summary: {
                totalPlayers: players.length,
                activePlayers: players.filter(p => !p.completed).length,
                completedPlayers: players.filter(p => p.completed).length,
                totalPinsCollected: trail.globalCollectedPins.length,
                totalPins: trail.pins.length
            }
        };
    }

    // ===== Storage =====

    private static async saveTrail(trail: CustomTrail): Promise<void> {
        if (isSupabaseConfigured()) {
            const { error } = await supabase!
                .from('custom_trails')
                .upsert(this.trailToDb(trail), { onConflict: 'id' });

            if (error) {
                console.error('Supabase saveTrail error:', error);
                throw new Error(`Failed to save trail: ${error.message}`);
            }
            return;
        }

        // File-based fallback
        this.ensureDirectory();
        fs.writeFileSync(this.getFilePath(trail.id), JSON.stringify(trail, null, 2));
    }

    // ===== DB conversion =====

    private static dbToTrail(data: any): CustomTrail {
        return {
            id: data.id,
            creatorId: data.creator_id,
            theme: data.theme,
            name: data.name,
            startLocation: data.start_location,
            pins: data.pins,
            mode: data.mode,
            competitive: data.competitive || false,
            globalCollectedPins: data.global_collected_pins || [],
            globalCollectedBy: data.global_collected_by || {},
            createdAt: data.created_at,
            expiresAt: data.expires_at,
            playCount: data.play_count,
            isActive: data.is_active,
            ...(data.dynamic_config ? { dynamicConfig: data.dynamic_config } : {})
        };
    }

    private static trailToDb(trail: CustomTrail): any {
        return {
            id: trail.id,
            creator_id: trail.creatorId,
            theme: trail.theme,
            name: trail.name,
            start_location: trail.startLocation,
            pins: trail.pins,
            mode: trail.mode,
            competitive: trail.competitive,
            global_collected_pins: trail.globalCollectedPins,
            global_collected_by: trail.globalCollectedBy,
            created_at: trail.createdAt,
            expires_at: trail.expiresAt,
            play_count: trail.playCount,
            is_active: trail.isActive,
            dynamic_config: trail.dynamicConfig || null
        };
    }
}
