// Custom Trail Types - User-created shareable treasure hunts

export type CustomTrailTheme = 'easter' | 'valentine' | 'general';

export interface CustomPin {
    lat: number;
    lng: number;
    icon: string;           // e.g. 'egg_red', 'heart_pink', 'treasure_chest'
    colour: string;         // indicator colour e.g. 'red', 'blue', 'gold'
    visible: boolean;       // shown on map or hidden (clue-based)
    question?: string;      // optional question on arrival (max 200 chars)
    answer?: string;        // answer to validate (max 200 chars)
    successMessage?: string; // shown on collection / clue for next pin (max 200 chars)
    order: number;          // sequential position (0-indexed)
}

export interface CustomTrail {
    id: string;
    creatorId: string;
    theme: CustomTrailTheme;
    name?: string;
    startLocation: { lat: number; lng: number } | null; // null = generate pins on first play
    pins: CustomPin[];
    mode: 'random' | 'custom';
    competitive: boolean;           // true = shared pins, free-roam, first-come-first-served
    globalCollectedPins: number[];  // pin indices claimed globally (competitive mode only)
    globalCollectedBy: Record<number, string>; // pinIndex -> userId who claimed it
    createdAt: number;
    expiresAt: number;
    playCount: number;
    isActive: boolean;
    // For dynamic trails (startLocation null) - config stored until first play
    dynamicConfig?: {
        count: number;
        icon?: string;
        successMessage?: string;
    };
}

export interface CustomTrailPlaySession {
    userId: string;
    gameType: string;           // 'CUSTOM_TRAIL_{trailId}'
    trailId: string;
    startTime: number;
    lastPosition: { lat: number; lng: number };
    collectedPins: number[];    // indices of collected pins
    currentPinIndex: number;
    completed: boolean;
    // Required by UniversalSession interface
    currentLevel: number;
    score: number;
    history: any[];

    // Reported hazard locations — exclusion zones for respawning
    exclusionZones?: Array<{ lat: number; lng: number }>;
}
