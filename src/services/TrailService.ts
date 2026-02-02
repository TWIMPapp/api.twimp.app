import { getStoredTrails } from '../data/games/index';
import { resolveTrail } from '../utils/resolveTrail';
import { Trail } from '../types/index';
import { GeoService } from './GeoService';
import { SessionService } from './SessionService';
import { GameConfigService } from './GameConfigService';

export class TrailService {
    static getAllTrails(): Trail[] {
        return getStoredTrails();
    }

    static getTrailByRef(ref: string): Trail | undefined {
        const trails = getStoredTrails();
        return trails.find(t => t.ref === ref);
    }

    static getResolvedTrail(ref: string): Trail | null {
        const trail = this.getTrailByRef(ref);
        return trail ? resolveTrail(trail) : null;
    }

    static async getTrailSummaries(lat?: number, lng?: number, userId?: string) {
        const trails = this.getAllTrails();
        const userSessions = userId ? await SessionService.getUserSessions(userId) : [];
        const sessionTrailRefs = new Set(userSessions.map(s => s.trail));

        // Get game config to filter active games
        const gameConfig = await GameConfigService.getAll();
        const configMap = new Map(gameConfig.map(c => [c.ref, c]));

        // Only include trails that exist in game_config (default is inactive/hidden)
        const activeTrails = trails.filter(t => {
            const config = configMap.get(t.ref);
            return config && config.status !== 'inactive';
        });

        const summaries = activeTrails.map(t => {
            const config = configMap.get(t.ref)!;
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
                status: config.status
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
