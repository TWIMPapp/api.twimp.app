// Easter Event Types - Story-driven community event

export interface EasterEventSession {
    userId: string;
    gameType: 'EASTER_EVENT';
    startTime: number;
    startPosition: { lat: number; lng: number };
    lastPosition: { lat: number; lng: number };
    safetyVerified: boolean;

    // Required by UniversalSession interface
    currentLevel: number;
    score: number;
    history: any[];

    // Daily tracking - keyed by ISO date string "2026-04-05"
    dailyEggs: Record<string, CollectedEgg[]>;

    // Unique codex per player
    codexMapping: Record<string, string>;       // Symbol -> Letter
    unlockedLetters: Record<string, boolean>;   // Letter -> unlocked

    // Current state
    currentEgg: EasterEgg | null;

    // Puzzle progress
    puzzlesSolved: PuzzleSolveRecord[];

    // Stats
    totalEggsCollected: number;
    uniqueLettersFound: number;
    goldenEggCollected: boolean;
}

export interface CollectedEgg {
    letter: string;
    collectedAt: number;
    isDuplicate: boolean;
    lat: number;
    lng: number;
}

export interface EasterEgg {
    lat: number;
    lng: number;
    spawnTime: number;
    expireTime: number;
    assignedLetter: string;     // Pre-assigned on spawn
    subject: 'MATH' | 'ENGLISH' | 'SCIENCE';
    isGoldenEgg?: boolean;      // Easter Sunday special egg
    // Question assigned when user arrives (so answer check uses same question)
    currentQuestion?: string;
    currentAnswer?: string;
}

export interface PuzzleSolveRecord {
    puzzleId: number;
    solvedAt: number;
    answer: string;
}

// Story chapter definition
export interface StoryChapter {
    id: number;
    title: string;
    dayOffset: number;          // Days from event start (0, 3, 5)
    scenes: ChapterScene[];
}

export interface ChapterScene {
    id: string;
    character: 'easter_bunny' | 'fergus' | 'narrator';
    characterImage?: string;    // Local asset path
    emotion?: 'default' | 'determined' | 'happy' | 'worried';
    narration: string;
    audioFile?: string;         // Local asset path
}

// Puzzle definition
export interface Puzzle {
    id: number;
    title: string;
    startDayOffset: number;     // Day puzzle becomes available
    durationHours: number;      // 48 hours each
    image: string;              // Puzzle image asset
    hint: string;
    answer: string;
    rewardLetters: string[];    // 2 letters per puzzle
}

// Mission update definition
export interface MissionUpdate {
    id: string;
    type: 'community' | 'story' | 'hint' | 'special';
    title: string;
    message: string;
    iconEmoji: string;
    dayOffset: number;          // Day to appear (0-7)
    hourOffset?: number;        // Hour within that day (for timed reveals)
}

// Clue definition (revealed daily)
export interface ClueConfig {
    text: string;
    revealDayOffset: number;
}

// Encoded clue for display
export interface EncodedClue {
    text: string;
    encoded: EncodedCharacter[];
    fullyDecoded: boolean;
}

export interface EncodedCharacter {
    char: string;               // Original character
    symbol: string;             // Codex symbol
    revealed: boolean;          // Whether player has unlocked this letter
}
