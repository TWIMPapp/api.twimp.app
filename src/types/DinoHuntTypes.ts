// Dino Egg Hunt Types - Jurassic Coast adventure game

export type DinoRarity = 'epic' | 'rare' | 'common';

export type DinoCategoryId =
    | 'fastest' | 'aggressive' | 'deadliest' | 'weirdest' | 'sea'
    | 'flying' | 'smartest' | 'biggest' | 'armoured' | 'horns_spikes';

export interface DinoStats {
    speed: number;        // 1-10
    size: number;         // 1-10
    strength: number;     // 1-10
    intelligence: number; // 1-10
    defence: number;      // 1-10
    aggression: number;   // 1-10
}

export interface Dinosaur {
    name: string;
    rarity: DinoRarity;
    stats: DinoStats;
    total: number;        // Sum of all stats
}

export interface DinoQuestionOption {
    label: string;
    rarity: DinoRarity;
}

export interface DinoQuestion {
    text: string;
    options: [DinoQuestionOption, DinoQuestionOption, DinoQuestionOption];
}

export interface DinoCategory {
    id: DinoCategoryId;
    name: string;
    emoji: string;
    eggColor: string;     // CSS color for map marker
    question: DinoQuestion;
    dinosaurs: Record<DinoRarity, Dinosaur>;
}

// ===== Session types =====

export type DinoHuntPhase = 'setup' | 'hunting' | 'golden_egg' | 'victory';

export interface DinoEgg {
    lat: number;
    lng: number;
    categoryId: DinoCategoryId;
    eggIndex: number;     // 0-9
    collected: boolean;
}

export interface CollectedDino {
    name: string;
    nickname: string;
    rarity: DinoRarity;
    stats: DinoStats;
    total: number;
    categoryId: DinoCategoryId;
    categoryName: string;
    eggIndex: number;
    collectedAt: number;
}

export interface DinoHuntSession {
    userId: string;
    gameType: 'DINO_HUNT';
    startTime: number;
    startPosition: { lat: number; lng: number };
    lastPosition: { lat: number; lng: number };

    // Required by UniversalSession interface
    currentLevel: number;
    score: number;

    // Game state
    phase: DinoHuntPhase;
    favoriteDino: string;           // Player's chosen favorite (for story flavor)
    eggs: DinoEgg[];                // 10 spawned eggs
    categoryOrder: DinoCategoryId[]; // Randomized assignment of categories to eggs
    collectedDinos: CollectedDino[];
    battleStory: string | null;
    spawnRadiusMeters: number;

    // Tracks which egg the player is currently answering (set on arrival)
    pendingEggIndex: number | null;

    // Reported hazard locations — exclusion zones for respawning
    exclusionZones?: Array<{ lat: number; lng: number }>;
}
