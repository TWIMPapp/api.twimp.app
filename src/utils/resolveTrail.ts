import { Trail, Step } from '../types/index';

/**
 * Resolves a raw Trail (with separated locations array) into a fully hydrated Trail
 * where each step has its location coordinates directly available, and every
 * in-trail map task's markers are resolved from location-id strings into
 * {lat, lng, title} objects the frontend can render.
 */
export function resolveTrail(trail: Trail): Trail {
    const locById = new Map((trail.locations || []).map(l => [l.id, l]));

    const resolveMarkerList = (markers: any): any => {
        if (!Array.isArray(markers)) {
            // Could be a state-keyed map { STATE: [...uuids] } — resolve each branch.
            if (markers && typeof markers === 'object') {
                const out: Record<string, any[]> = {};
                for (const [k, v] of Object.entries(markers)) {
                    out[k] = Array.isArray(v) ? v.map(resolveMarker).filter(Boolean) : [];
                }
                return out;
            }
            return markers;
        }
        return markers.map(resolveMarker).filter(Boolean);
    };

    const resolveMarker = (m: any): any => {
        if (typeof m === 'string') {
            const loc = locById.get(m);
            if (!loc) return null;
            return { id: m, lat: loc.lat, lng: loc.lng, title: loc.name };
        }
        // Already an object — pass through (older trails or default-map markers)
        return m;
    };

    const resolvedSteps = trail.steps.map((step) => {
        // Find the location coordinates for this step
        // Priority:
        // 1. step.locationId (matches locations array item id)
        // 2. step.location (legacy format, if it already has lat/lng)
        // 3. Fallback to undefined

        let latLon: { lat: number; lng: number } | undefined;

        if (step.locationId && locById.has(step.locationId)) {
            const loc = locById.get(step.locationId)!;
            latLon = { lat: loc.lat, lng: loc.lng };
        } else if ((step as any).location?.coordinates) {
            // Support 'Point' type from legacy data
            const coords = (step as any).location.coordinates;
            latLon = { lat: coords[0], lng: coords[1] };
        } else if ((step as any).location?.lat) {
            latLon = { lat: (step as any).location.lat, lng: (step as any).location.lng };
        }

        // Hydrate every map task's markers from location-id strings to objects
        // the client can render. Conditional markers (state-keyed object) get
        // each branch resolved.
        const resolvedTasks = step.tasks?.map(task => {
            if (task?.type !== 'map' || !task.markers) return task;
            return { ...task, markers: resolveMarkerList(task.markers) };
        });

        return {
            ...step,
            location: latLon as any,
            tasks: resolvedTasks as any,
        };
    });

    return {
        ...trail,
        steps: resolvedSteps as Step[]
    };
}
