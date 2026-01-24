import { ClueConfig } from '../../types/EasterEventTypes.js';

export const EASTER_EVENT_CONFIG = {
    // Configurable limits
    DAILY_EGG_LIMIT: 5,
    PUZZLE_DURATION_HOURS: 48,
    PUZZLE_START_HOUR: 17,  // 5pm - puzzles start at this hour each day
    EGG_EXPIRE_MINUTES: 30,
    COLLECTION_RADIUS_METERS: 20,
    SPAWN_RADIUS_METERS: 500,
    MIN_SPAWN_DISTANCE_METERS: 100,

    // TEST MODE: Set to 0-7 to override day, or null for real date
    // Day 0 = event start, Day 7 = Easter Sunday
    TEST_DAY_OVERRIDE: 3 as number | null,

    // Event dates (update each year)
    // For 2026: Easter Sunday is April 5, event starts Friday March 27 (9 days before)
    EVENT_START_DATE: "2026-03-27",
    EVENT_END_DATE: "2026-04-05",

    // Weighted letter probabilities (0-1 scale)
    // Vowels: 0.9, Common: 0.5, Rare: 0.2, Very rare: 0.1
    LETTER_WEIGHTS: {
        'A': 0.9, 'B': 0.5, 'C': 0.5, 'D': 0.5, 'E': 0.9, 'F': 0.2,
        'G': 0.1, 'H': 0.5, 'I': 0.9, 'J': 0.5, 'K': 0.2, 'L': 0.5,
        'M': 0.2, 'N': 0.5, 'O': 0.9, 'P': 0.2, 'Q': 0.2, 'R': 0.5,
        'S': 0.5, 'T': 0.5, 'U': 0.1, 'V': 0.2, 'W': 0.5, 'X': 0.1,
        'Y': 0.5, 'Z': 0.1
    } as Record<string, number>,

    // Puzzle rewards (rare letters from puzzles)
    // Last 2 puzzles give very rare letters
    PUZZLE_REWARD_LETTERS: {
        1: ['Q', 'K'],      // Puzzle 1 - rare (Fri Mar 27)
        2: ['V', 'W'],      // Puzzle 2 (Sun Mar 29)
        3: ['X', 'U'],      // Puzzle 3 - very rare (Tue Mar 31)
        4: ['J', 'F'],      // Puzzle 4 (Thu Apr 2)
        5: ['Z', 'G']       // Puzzle 5 - Z very rare, G for GERARDIA (Easter Sat Apr 4)
    } as Record<number, string[]>,

    // Clues - revealed daily, separate from puzzles
    // Simnel Cake ingredients (no & symbol, each item separate)
    CLUES: [
        { text: "FLOUR", revealDayOffset: 0 },           // Day 1 - starting
        { text: "BAKING POWDER", revealDayOffset: 0 },   // Day 1 - starting
        { text: "SALT", revealDayOffset: 0 },            // Day 1 - starting
        { text: "BUTTER", revealDayOffset: 1 },          // Day 2
        { text: "SUGAR", revealDayOffset: 2 },           // Day 3
        { text: "EGGS", revealDayOffset: 3 },            // Day 4
        { text: "LEMON ZEST", revealDayOffset: 4 },      // Day 5
        { text: "NUTMEG", revealDayOffset: 5 },          // Day 6
        { text: "MIXED FRUIT", revealDayOffset: 6 },     // Day 7 (has rare letters)
        { text: "MARZIPAN", revealDayOffset: 7 }         // Day 8 Easter (has rare letters)
    ] as ClueConfig[],

    // Golden Egg configuration
    GOLDEN_EGG: {
        message: "GERARDIA",    // False Foxglove - cliffhanger
        dayOffset: 9            // Easter Sunday (April 5, 2026)
    },

    // 26 emoji symbols for codex (same as existing game)
    SYMBOLS: [
        '⚡', '⭐', '🌙', '☀️', '🌈', '❤️', '🔥', '💧', '🌸', '🍀',
        '🦋', '🐝', '🎵', '🎨', '⚽', '🎯', '🔔', '⚓', '🎪', '🎭',
        '🎸', '🎮', '🚀', '🏆', '💎', '👑'
    ],

    ALPHABET: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
};
