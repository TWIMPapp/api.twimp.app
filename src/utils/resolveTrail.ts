import { Trail, Step } from '../types/index.js';

/**
 * Resolves a raw Trail (with separated locations array) into a fully hydrated Trail
 * where each step has its location coordinates directly available.
 */
export function resolveTrail(trail: Trail): Trail {
    const resolvedSteps = trail.steps.map((step) => {
        // Find the location coordinates for this step
        // Priority:
        // 1. step.locationId (matches locations array item id)
        // 2. step.location (legacy format, if it already has lat/lng)
        // 3. Fallback to undefined

        let latLon: { lat: number; lng: number } | undefined;

        if (step.locationId && trail.locations) {
            const loc = trail.locations.find((l) => l.id === step.locationId);
            if (loc) {
                latLon = { lat: loc.lat, lng: loc.lng };
            }
        } else if ((step as any).location?.coordinates) {
            // Support 'Point' type from legacy data
            const coords = (step as any).location.coordinates;
            latLon = { lat: coords[0], lng: coords[1] };
        } else if ((step as any).location?.lat) {
            latLon = { lat: (step as any).location.lat, lng: (step as any).location.lng };
        }

        return {
            ...step,
            location: latLon as any
        };
    });

    return {
        ...trail,
        steps: resolvedSteps as Step[]
    };
}
