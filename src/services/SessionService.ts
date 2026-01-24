export interface GameSession {
    userId: string;
    trail: string;
    task: number;
    path: string;
    state: string;
    items: any[];
    input: Record<string, string>;
    playStart: number;
    playEnd?: string;
    lastAWTY?: number;
    retries: number;
    score?: number;
}

export interface UniversalSession {
    userId: string;
    gameType: string;
    startTime: number;
    lastPosition: { lat: number; lng: number };
    currentLevel: number;
    score: number;
    history: any[];
    codexMapping?: Record<string, string>;
    currentEgg?: any;
    currentEggs?: any[]; // For multi-choice
}

import fs from 'fs';
import path from 'path';
import { supabase, isSupabaseConfigured } from '../config/supabase';

const SESSIONS_DIR = path.join(process.cwd(), 'src/data/sessions');

export class SessionService {
    // ===== File-based helpers (fallback for local dev) =====

    private static ensureDirectory() {
        if (!fs.existsSync(SESSIONS_DIR)) {
            fs.mkdirSync(SESSIONS_DIR, { recursive: true });
        }
    }

    private static getFilePath(userId: string, trailRef: string): string {
        const safeTrailRef = trailRef.replace(/[^a-z0-9_-]/gi, '_');
        return path.join(SESSIONS_DIR, `${userId}_${safeTrailRef}.json`);
    }

    private static getUniversalFilePath(userId: string, gameType: string): string {
        return path.join(SESSIONS_DIR, `univ_${userId}_${gameType.toLowerCase()}.json`);
    }

    // ===== Game Sessions (trail-based) =====

    static async getSession(userId: string, trailRef: string): Promise<GameSession> {
        if (isSupabaseConfigured()) {
            try {
                const { data, error } = await supabase!
                    .from('game_sessions')
                    .select('*')
                    .eq('user_id', userId)
                    .eq('trail_ref', trailRef)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    console.error('Supabase getSession error:', error);
                }

                if (data) {
                    return this.dbToGameSession(data);
                }
            } catch (e) {
                console.error('Failed to get session from Supabase:', e);
            }
        } else {
            // File-based fallback
            this.ensureDirectory();
            const filePath = this.getFilePath(userId, trailRef);

            if (fs.existsSync(filePath)) {
                try {
                    const data = fs.readFileSync(filePath, 'utf8');
                    return JSON.parse(data);
                } catch (e) {
                    console.error(`Failed to read session for ${userId} / ${trailRef}:`, e);
                }
            }
        }

        return this.createDefaultSession(userId, trailRef);
    }

    // Sync version for backward compatibility
    static getSessionSync(userId: string, trailRef: string): GameSession {
        if (!isSupabaseConfigured()) {
            this.ensureDirectory();
            const filePath = this.getFilePath(userId, trailRef);

            if (fs.existsSync(filePath)) {
                try {
                    const data = fs.readFileSync(filePath, 'utf8');
                    return JSON.parse(data);
                } catch (e) {
                    console.error(`Failed to read session for ${userId} / ${trailRef}:`, e);
                }
            }
        }
        return this.createDefaultSession(userId, trailRef);
    }

    static async getUserSessions(userId: string): Promise<GameSession[]> {
        if (isSupabaseConfigured()) {
            try {
                const { data, error } = await supabase!
                    .from('game_sessions')
                    .select('*')
                    .eq('user_id', userId);

                if (error) {
                    console.error('Supabase getUserSessions error:', error);
                    return [];
                }

                return (data || []).map((d: any) => this.dbToGameSession(d));
            } catch (e) {
                console.error('Failed to get user sessions from Supabase:', e);
                return [];
            }
        }

        // File-based fallback
        this.ensureDirectory();
        if (!fs.existsSync(SESSIONS_DIR)) return [];

        const files = fs.readdirSync(SESSIONS_DIR);
        const sessions: GameSession[] = [];

        for (const file of files) {
            if (file.startsWith(`${userId}_`) && file.endsWith('.json') && !file.startsWith('univ_')) {
                try {
                    const data = fs.readFileSync(path.join(SESSIONS_DIR, file), 'utf8');
                    sessions.push(JSON.parse(data));
                } catch (e) {
                    console.error(`Error reading session file ${file}:`, e);
                }
            }
        }
        return sessions;
    }

    static async saveSession(session: GameSession): Promise<void> {
        if (isSupabaseConfigured()) {
            try {
                const { error } = await supabase!
                    .from('game_sessions')
                    .upsert(this.gameSessionToDb(session), {
                        onConflict: 'user_id,trail_ref'
                    });

                if (error) {
                    console.error('Supabase saveSession error:', error);
                }
                return;
            } catch (e) {
                console.error('Failed to save session to Supabase:', e);
            }
        }

        // File-based fallback
        this.ensureDirectory();
        const filePath = this.getFilePath(session.userId, session.trail);
        fs.writeFileSync(filePath, JSON.stringify(session, null, 2));
    }

    // Sync version for backward compatibility
    static saveSessionSync(session: GameSession): void {
        if (!isSupabaseConfigured()) {
            this.ensureDirectory();
            const filePath = this.getFilePath(session.userId, session.trail);
            fs.writeFileSync(filePath, JSON.stringify(session, null, 2));
        }
        // Note: For Supabase, use the async version
    }

    static async deleteSession(userId: string, trailRef: string): Promise<void> {
        if (isSupabaseConfigured()) {
            try {
                const { error } = await supabase!
                    .from('game_sessions')
                    .delete()
                    .eq('user_id', userId)
                    .eq('trail_ref', trailRef);

                if (error) {
                    console.error('Supabase deleteSession error:', error);
                }
                return;
            } catch (e) {
                console.error('Failed to delete session from Supabase:', e);
            }
        }

        // File-based fallback
        const filePath = this.getFilePath(userId, trailRef);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    // ===== Universal Sessions (Easter Event, etc.) =====

    static async getUniversalSession(userId: string, gameType: string): Promise<UniversalSession | null> {
        if (isSupabaseConfigured()) {
            try {
                const { data, error } = await supabase!
                    .from('universal_sessions')
                    .select('*')
                    .eq('user_id', userId)
                    .eq('game_type', gameType)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    console.error('Supabase getUniversalSession error:', error);
                }

                if (data) {
                    return this.dbToUniversalSession(data);
                }
                return null;
            } catch (e) {
                console.error('Failed to get universal session from Supabase:', e);
                return null;
            }
        }

        // File-based fallback
        this.ensureDirectory();
        const filePath = this.getUniversalFilePath(userId, gameType);
        if (fs.existsSync(filePath)) {
            try {
                return JSON.parse(fs.readFileSync(filePath, 'utf8'));
            } catch (e) {
                console.error(`Failed to read universal session:`, e);
            }
        }
        return null;
    }

    // Sync version for backward compatibility - returns cached/file data only
    static getUniversalSessionSync(userId: string, gameType: string): UniversalSession | null {
        if (!isSupabaseConfigured()) {
            this.ensureDirectory();
            const filePath = this.getUniversalFilePath(userId, gameType);
            if (fs.existsSync(filePath)) {
                try {
                    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
                } catch (e) {
                    console.error(`Failed to read universal session:`, e);
                }
            }
        }
        return null;
    }

    static async saveUniversalSession(session: UniversalSession): Promise<void> {
        if (isSupabaseConfigured()) {
            try {
                const { error } = await supabase!
                    .from('universal_sessions')
                    .upsert(this.universalSessionToDb(session), {
                        onConflict: 'user_id,game_type'
                    });

                if (error) {
                    console.error('Supabase saveUniversalSession error:', error);
                }
                return;
            } catch (e) {
                console.error('Failed to save universal session to Supabase:', e);
            }
        }

        // File-based fallback
        this.ensureDirectory();
        const filePath = this.getUniversalFilePath(session.userId, session.gameType);
        fs.writeFileSync(filePath, JSON.stringify(session, null, 2));
    }

    // Sync version for backward compatibility
    static saveUniversalSessionSync(session: UniversalSession): void {
        if (!isSupabaseConfigured()) {
            this.ensureDirectory();
            const filePath = this.getUniversalFilePath(session.userId, session.gameType);
            fs.writeFileSync(filePath, JSON.stringify(session, null, 2));
        }
    }

    static async clearUniversalSession(userId: string, gameType: string): Promise<void> {
        if (isSupabaseConfigured()) {
            try {
                const { error } = await supabase!
                    .from('universal_sessions')
                    .delete()
                    .eq('user_id', userId)
                    .eq('game_type', gameType);

                if (error) {
                    console.error('Supabase clearUniversalSession error:', error);
                }
                return;
            } catch (e) {
                console.error('Failed to clear universal session from Supabase:', e);
            }
        }

        // File-based fallback
        const filePath = this.getUniversalFilePath(userId, gameType);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    // ===== Helper methods =====

    static createDefaultSession(userId: string, trailRef: string): GameSession {
        return {
            userId,
            trail: trailRef,
            task: -1,
            retries: 0,
            playStart: 0,
            path: "",
            state: "",
            items: [],
            input: {}
        };
    }

    // ===== Database conversion helpers =====

    private static dbToGameSession(data: any): GameSession {
        return {
            userId: data.user_id,
            trail: data.trail_ref,
            task: data.task,
            path: data.path || '',
            state: data.state || '',
            items: data.items || [],
            input: data.input || {},
            playStart: data.play_start,
            playEnd: data.play_end,
            lastAWTY: data.last_awty,
            retries: data.retries,
            score: data.score
        };
    }

    private static gameSessionToDb(session: GameSession): any {
        return {
            user_id: session.userId,
            trail_ref: session.trail,
            task: session.task,
            path: session.path,
            state: session.state,
            items: session.items,
            input: session.input,
            play_start: session.playStart,
            play_end: session.playEnd,
            last_awty: session.lastAWTY,
            retries: session.retries,
            score: session.score
        };
    }

    private static dbToUniversalSession(data: any): UniversalSession {
        // Merge base fields with session_data JSONB
        const sessionData = data.session_data || {};
        return {
            userId: data.user_id,
            gameType: data.game_type,
            startTime: data.start_time,
            lastPosition: data.last_position || { lat: 0, lng: 0 },
            currentLevel: data.current_level,
            score: data.score,
            history: data.history || [],
            ...sessionData  // Spread any additional fields from session_data
        };
    }

    private static universalSessionToDb(session: UniversalSession): any {
        // Extract known fields, put the rest in session_data
        const { userId, gameType, startTime, lastPosition, currentLevel, score, history, ...extraFields } = session;
        return {
            user_id: userId,
            game_type: gameType,
            start_time: startTime,
            last_position: lastPosition,
            current_level: currentLevel,
            score: score,
            history: history,
            session_data: extraFields  // Store Easter Event specific fields here
        };
    }
}
