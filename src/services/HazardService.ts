// HazardService — Shared hazard reporting and pin respawn logic
// Used by DinoHuntService and CustomTrailService for "report unreachable" feature

import { GeoService } from './GeoService';
import { supabase, isSupabaseConfigured } from '../config/supabase';

const MIN_DIST_FROM_PLAYER = 100;  // Anti-cheat: new pin must be at least 100m from player
const EXCLUSION_RADIUS = 100;       // Exclusion zone around each reported location
const MAX_RETRIES = 100;

export class HazardService {

    /**
     * Handles a hazard report: logs it, updates exclusion zones, finds a new spawn point.
     * Returns the new location and updated exclusion zones, or { ok: false } on failure.
     * The calling service handles game-specific pin mutation and save.
     */
    static async handleReport(params: {
        userId: string;
        category: string;
        reportedLocation: { lat: number; lng: number };
        playerPosition: { lat: number; lng: number };
        exclusionZones: Array<{ lat: number; lng: number }>;
        gameCenter: { lat: number; lng: number };
        spawnRadius: number;
        otherPins: Array<{ lat: number; lng: number }>;
        minSpacing: number;
    }): Promise<{
        ok: boolean;
        newLocation?: { lat: number; lng: number };
        updatedExclusions: Array<{ lat: number; lng: number }>;
        message?: string;
    }> {
        const {
            userId, category, reportedLocation, playerPosition,
            exclusionZones, gameCenter, spawnRadius, otherPins, minSpacing
        } = params;

        // 1. Log the hazard report
        await this.logHazardReport(userId, category, reportedLocation.lat, reportedLocation.lng);

        // 2. Add reported location to exclusion zones
        const updatedExclusions = [...exclusionZones, { lat: reportedLocation.lat, lng: reportedLocation.lng }];

        // 3. Find a new spawn point satisfying all constraints
        const newLocation = this.findConstrainedSpawnPoint({
            gameCenter,
            spawnRadius,
            playerPosition,
            minDistFromPlayer: MIN_DIST_FROM_PLAYER,
            existingPoints: otherPins,
            minSpacing,
            exclusionZones: updatedExclusions,
            exclusionRadius: EXCLUSION_RADIUS,
        });

        if (!newLocation) {
            return {
                ok: false,
                updatedExclusions,
                message: 'Could not find a safe new location. Try moving to a different area.',
            };
        }

        return { ok: true, newLocation, updatedExclusions };
    }

    /**
     * Finds a spawn point satisfying all constraints:
     * - Within spawnRadius of gameCenter
     * - At least minDistFromPlayer from playerPosition
     * - At least minSpacing from all existingPoints
     * - At least exclusionRadius from ALL exclusion zones
     */
    private static findConstrainedSpawnPoint(params: {
        gameCenter: { lat: number; lng: number };
        spawnRadius: number;
        playerPosition: { lat: number; lng: number };
        minDistFromPlayer: number;
        existingPoints: Array<{ lat: number; lng: number }>;
        minSpacing: number;
        exclusionZones: Array<{ lat: number; lng: number }>;
        exclusionRadius: number;
    }): { lat: number; lng: number } | null {
        const {
            gameCenter, spawnRadius, playerPosition, minDistFromPlayer,
            existingPoints, minSpacing, exclusionZones, exclusionRadius
        } = params;

        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            const angle = Math.random() * 2 * Math.PI;
            const distance = minSpacing + Math.random() * (spawnRadius - minSpacing);

            const dLat = (distance * Math.cos(angle)) / 111320;
            const dLng = (distance * Math.sin(angle)) / (111320 * Math.cos(gameCenter.lat * Math.PI / 180));

            const candidate = {
                lat: gameCenter.lat + dLat,
                lng: gameCenter.lng + dLng,
            };

            // Check: within spawn radius of game center
            const distFromCenter = GeoService.getDistanceFromLatLonInMeters(
                gameCenter.lat, gameCenter.lng, candidate.lat, candidate.lng
            );
            if (distFromCenter > spawnRadius) continue;

            // Check: at least minDistFromPlayer from player
            const distFromPlayer = GeoService.getDistanceFromLatLonInMeters(
                playerPosition.lat, playerPosition.lng, candidate.lat, candidate.lng
            );
            if (distFromPlayer < minDistFromPlayer) continue;

            // Check: at least minSpacing from all existing pins
            const tooCloseToPin = existingPoints.some(p =>
                GeoService.getDistanceFromLatLonInMeters(p.lat, p.lng, candidate.lat, candidate.lng) < minSpacing
            );
            if (tooCloseToPin) continue;

            // Check: at least exclusionRadius from ALL exclusion zones
            const inExclusionZone = exclusionZones.some(z =>
                GeoService.getDistanceFromLatLonInMeters(z.lat, z.lng, candidate.lat, candidate.lng) < exclusionRadius
            );
            if (inExclusionZone) continue;

            return candidate;
        }

        return null;
    }

    /**
     * Logs a hazard report to the hazard_reports table for future crowdsourced data.
     */
    private static async logHazardReport(
        userId: string, category: string, lat: number, lng: number
    ): Promise<void> {
        console.log(`[HazardReport] user=${userId} category=${category} at (${lat},${lng})`);

        if (isSupabaseConfigured()) {
            try {
                const { error } = await supabase!.from('hazard_reports').insert({
                    user_id: userId,
                    category,
                    lat,
                    lng,
                    reported_at: Date.now(),
                });
                if (error) {
                    console.error('[HazardReport] Supabase insert error:', error);
                }
            } catch (e) {
                console.error('[HazardReport] Failed to log:', e);
            }
        }
    }
}
