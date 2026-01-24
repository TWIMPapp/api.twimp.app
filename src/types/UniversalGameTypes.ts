export interface UniversalGameSession {
    userId: string;
    gameType: 'EGG_HUNT' | 'OTHER';
    startTime: number;
    startPosition?: { lat: number; lng: number }; // Initial game start location
    lastPosition: { lat: number; lng: number };
    currentLevel: number; // 1-30
    score: number;
    history: EggEvent[];
    codexMapping: Record<string, string>; // SymbolID -> Letter
    symbolUnlocks?: Record<string, boolean>; // Letter -> Success (true/false)
}

export interface EggEvent {
    level: number;
    eggId: string;
    spawnTime: number;
    collectTime?: number;
    expireTime: number;
    lat: number;
    lng: number;
    subject?: 'MATH' | 'ENGLISH' | 'SCIENCE';
    success?: boolean;
    answer?: string;
}

export interface EggHuntQuestion {
    id: string;
    phase: 1 | 2 | 3 | 4;
    subject: 'MATH' | 'ENGLISH' | 'SCIENCE' | 'SPECIAL';
    level: number;
    question: string;
    options?: string[];
    answer: string;
    hint?: string;
}

export interface SymbolCodex {
    mapping: Record<string, string>; // e.g., "sym_1": "A"
}
