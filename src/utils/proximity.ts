// Proximity helpers shared by GameEngineService.handleAWTY.
//
// Inverted proximity step: `on_search.inverted: true`. Same radius
// (proximity_radius + accuracy buffer) and same gating (state, requiredSteps,
// requiredItems, can_revisit, not-current-step) as a normal step, but it
// triggers when the fix is OUTSIDE the catchment.

export function isInvertedStep(step: any): boolean {
    return step?.on_search?.inverted === true;
}

export function isTriggered(distanceInMetres: number, catchmentRadius: number, inverted: boolean): boolean {
    return inverted ? distanceInMetres > catchmentRadius : distanceInMetres < catchmentRadius;
}

// `steps` must already be sorted nearest-first and carry allowed/inRange/inverted.
// Any matching normal step wins; an inverted step fires only when no normal
// step matched.
export function pickActivatedStep<T extends { allowed: boolean; inRange: boolean; inverted?: boolean }>(steps: T[]): T | undefined {
    const matches = steps.filter(s => s.allowed && s.inRange);
    return matches.find(s => !s.inverted) ?? matches.find(s => s.inverted);
}
