import { getStoredTrails } from '../data/games/index';
import { resolveTrail } from '../utils/resolveTrail';
import { Trail } from '../types/index';
import { GeoService } from './GeoService';
import { SessionService } from './SessionService';
import { GameConfigService } from './GameConfigService';
import { supabase, isSupabaseConfigured } from '../config/supabase';

// Cache for dynamic trails (TTL-based)
let dynamicTrailCache: Trail[] | null = null;
let dynamicCacheTime = 0;
const CACHE_TTL_MS = 30_000; // 30 seconds

export class TrailService {
    // Get all trails — static files + dynamic from Supabase
    static getAllTrails(): Trail[] {
        const staticTrails = getStoredTrails();
        const dynamic = dynamicTrailCache || [];
        return [...staticTrails, ...dynamic];
    }

    // Get a single trail by ref — check static first, then dynamic/Supabase
    static getTrailByRef(ref: string): Trail | undefined {
        const staticTrail = getStoredTrails().find(t => t.ref === ref);
        if (staticTrail) return staticTrail;

        // Check cache
        if (dynamicTrailCache) {
            const cached = dynamicTrailCache.find(t => t.ref === ref);
            if (cached) return cached;
        }

        return undefined;
    }

    // Async version that checks Supabase if not found in cache
    static async getTrailByRefAsync(ref: string): Promise<Trail | undefined> {
        // Check static first
        const staticTrail = getStoredTrails().find(t => t.ref === ref);
        if (staticTrail) return staticTrail;

        // Check cache
        if (dynamicTrailCache) {
            const cached = dynamicTrailCache.find(t => t.ref === ref);
            if (cached) return cached;
        }

        // Fetch from Supabase
        if (!isSupabaseConfigured()) return undefined;

        try {
            const { data, error } = await supabase!
                .from('trails')
                .select('trail_data')
                .eq('ref', ref)
                .eq('is_active', true)
                .single();

            if (error || !data) return undefined;
            return data.trail_data as Trail;
        } catch {
            return undefined;
        }
    }

    static getResolvedTrail(ref: string): Trail | null {
        const trail = this.getTrailByRef(ref);
        return trail ? resolveTrail(trail) : null;
    }

    // Async version for dynamic trails
    static async getResolvedTrailAsync(ref: string): Promise<Trail | null> {
        const trail = await this.getTrailByRefAsync(ref);
        return trail ? resolveTrail(trail) : null;
    }

    // Save a dynamically created trail to Supabase
    static async saveTrail(trail: Trail, creatorId?: string, source: string = 'dynamic'): Promise<{ ok: boolean; message?: string }> {
        if (!isSupabaseConfigured()) {
            return { ok: false, message: 'Database not configured' };
        }

        try {
            const { error } = await supabase!
                .from('trails')
                .upsert({
                    ref: trail.ref,
                    trail_data: trail,
                    creator_id: creatorId || null,
                    source,
                    is_active: true
                }, { onConflict: 'ref' });

            if (error) {
                console.error('Failed to save trail:', error);
                return { ok: false, message: error.message };
            }

            // Invalidate cache
            dynamicTrailCache = null;

            return { ok: true };
        } catch (e) {
            console.error('Failed to save trail:', e);
            return { ok: false, message: 'Failed to save trail' };
        }
    }

    // Refresh dynamic trail cache from Supabase
    static async refreshDynamicTrails(): Promise<void> {
        if (!isSupabaseConfigured()) return;
        if (Date.now() - dynamicCacheTime < CACHE_TTL_MS && dynamicTrailCache) return;

        try {
            const { data, error } = await supabase!
                .from('trails')
                .select('trail_data')
                .eq('is_active', true);

            if (!error && data) {
                dynamicTrailCache = data.map((d: any) => d.trail_data as Trail);
                dynamicCacheTime = Date.now();
            }
        } catch {
            // Keep existing cache on failure
        }
    }

    // Generic query against the trails table with optional filters.
    // Used for any scoped listing (e.g. by creator). Bypasses the static
    // set and the dynamic cache.
    static async queryTrails(filters: { creatorId?: string; isActive?: boolean } = {}): Promise<Trail[]> {
        if (!isSupabaseConfigured()) return [];
        try {
            let q = supabase!.from('trails').select('trail_data');
            if (filters.creatorId !== undefined) q = q.eq('creator_id', filters.creatorId);
            if (filters.isActive !== undefined) q = q.eq('is_active', filters.isActive);
            const { data, error } = await q;
            if (error || !data) return [];
            return data.map((d: any) => d.trail_data as Trail);
        } catch {
            return [];
        }
    }

    static async getTrailSummaries(lat?: number, lng?: number, userId?: string, creatorId?: string) {
        const userSessions = userId ? await SessionService.getUserSessions(userId) : [];
        const sessionTrailRefs = new Set(userSessions.map(s => s.trail));

        // Creator-scoped path: return only that creator's dynamic trails,
        // skipping static trails and the game_config curation filter.
        // 'twimp' is a sentinel for the curated (default) path.
        const isCreatorScoped = creatorId !== undefined && creatorId !== 'twimp';

        let activeTrails: Trail[];
        let configMap: Map<string, { ref: string; status: string }>;

        if (isCreatorScoped) {
            activeTrails = await this.queryTrails({ creatorId: creatorId!, isActive: true });
            configMap = new Map(); // no curation filter for creator-scoped listings
        } else {
            // Refresh dynamic trails (only needed for the curated path)
            await this.refreshDynamicTrails();
            const trails = this.getAllTrails();
            const gameConfig = await GameConfigService.getAll();
            configMap = new Map(gameConfig.map(c => [c.ref, c]));
            // Only include trails that exist in game_config (default is inactive/hidden)
            activeTrails = trails.filter(t => {
                const config = configMap.get(t.ref);
                return config && config.status !== 'inactive';
            });
        }

        const summaries = activeTrails.map(t => {
            const config = configMap.get(t.ref);
            // EVENT games (content_pack) work anywhere, no location needed
            const isEvent = t.type === 'EVENT' || t.content_pack;

            const firstStepLocationId = t.steps?.[0]?.locationId;
            const startLocation = firstStepLocationId
                ? t.locations?.find(loc => loc.id === firstStepLocationId)
                : t.locations?.[0];

            const trailLat = isEvent ? null : (startLocation?.lat ?? null);
            const trailLng = isEvent ? null : (startLocation?.lng ?? null);

            let distanceInMiles = null;
            if (!isEvent && lat !== undefined && lng !== undefined && trailLat !== null && trailLng !== null) {
                const distanceInMetres = GeoService.getDistanceFromLatLonInMeters(lat, lng, trailLat, trailLng);
                distanceInMiles = distanceInMetres * 0.000621371;
            }

            return {
                ref: t.ref,
                name: t.name,
                description: t.description,
                image_url: t.image_url,
                lat: trailLat,
                lng: trailLng,
                isFree: t.isFree ?? true,
                distanceInMiles,
                hasSession: sessionTrailRefs.has(t.ref),
                type: t.type,
                gradient: t.gradient,
                content_pack: t.content_pack,
                status: config?.status ?? 'active'
            };
        });

        // Featured = promoted games shown in a banner/carousel
        const featured = summaries.filter(s => s.status === 'featured');

        // Categorize remaining by session existence
        const playAgain = summaries.filter(s => s.hasSession);
        const discoverable = summaries.filter(s => !s.hasSession);

        let nearYou = discoverable;
        if (lat !== undefined && lng !== undefined) {
            nearYou = nearYou
                .filter(s => s.distanceInMiles !== null && s.distanceInMiles <= 50)
                .sort((a, b) => (a.distanceInMiles || 0) - (b.distanceInMiles || 0))
                .slice(0, 10);
        }

        return {
            featured,
            playAgain,
            nearYou,
            all: discoverable
        };
    }
}
