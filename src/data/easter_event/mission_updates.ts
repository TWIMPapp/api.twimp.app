import { MissionUpdate } from '../../types/EasterEventTypes';

// Mission updates for the Easter Event news feed
// Filtered by date only (no puzzle/progress dependencies)
// These appear in reverse chronological order (newest first)
//
// Timeline: Event starts March 27 (dayOffset 0), Easter Sunday = April 5 (dayOffset 9)
// Rule: No mission update before 9am (hourOffset >= 9)
// Rule: No update should reveal information before its corresponding chapter

export const MISSION_UPDATES: MissionUpdate[] = [
    // Day 1 — dayOffset 0 (Fri Mar 27) — Chapter 1 available at 8am
    {
        id: "mu_001",
        type: "story",
        title: "Mission Begins!",
        message: "Children across the nation have joined the search for the missing eggs! The Easter Bunny is counting on us!",
        iconEmoji: "🔍",
        dayOffset: 0,
        hourOffset: 15  // 9am
    },
    {
        id: "mu_002",
        type: "hint",
        title: "Strange Symbols",
        message: "Some children are reporting strange symbols on the eggs. What could they mean?",
        iconEmoji: "❓",
        dayOffset: 0,
        hourOffset: 18  // 2pm
    },

    // Day 2 — dayOffset 1 (Sat Mar 28)
    {
        id: "mu_003",
        type: "community",
        title: "Egg Count Rising!",
        message: "Over 1,000 eggs have been collected nationwide! Keep searching!",
        iconEmoji: "📈",
        dayOffset: 1,
        hourOffset: 9  // 9am
    },
    {
        id: "mu_004",
        type: "hint",
        title: "Community Theory",
        message: "Some players are suggesting the symbols might be a secret alphabet...",
        iconEmoji: "💡",
        dayOffset: 1,
        hourOffset: 16  // 4pm
    },

    // Day 3 — dayOffset 2 (Sun Mar 29) — Chapter 2 available at 8am
    {
        id: "mu_005",
        type: "community",
        title: "5,000 Eggs!",
        message: "We've passed 5,000 eggs collected! The Easter Bunny is amazed by your help!",
        iconEmoji: "🎉",
        dayOffset: 2,
        hourOffset: 9  // 9am
    },

    // Day 4 — dayOffset 3 (Mon Mar 30) — Chapter 2 already out, purple glove safe to reference
    {
        id: "mu_006",
        type: "story",
        title: "Clue Found!",
        message: "The Easter Bunny has found a purple glove at the warehouse! A suspect emerges...",
        iconEmoji: "🧤",
        dayOffset: 3,
        hourOffset: 9  // 9am
    },

    // Day 5 — dayOffset 4 (Tue Mar 31)
    {
        id: "mu_008",
        type: "community",
        title: "10,000 Eggs!",
        message: "Incredible! 10,000 eggs collected! You're all amazing egg hunters!",
        iconEmoji: "🏆",
        dayOffset: 4,
        hourOffset: 9  // 9am
    },

    // Day 6 — dayOffset 5 (Wed Apr 1) — Chapter 3 available at 8am
    // Codex and recipe reveals now safe (Chapter 3 already out)
    {
        id: "mu_007",
        type: "hint",
        title: "Codex Confirmed",
        message: "It's confirmed - the symbols ARE letters! Build your Codex to decode the clues!",
        iconEmoji: "📜",
        dayOffset: 5,
        hourOffset: 12  // Noon — gives morning to read Chapter 3
    },
    {
        id: "mu_009",
        type: "hint",
        title: "Recipe Theory",
        message: "The decoded clues seem to be... ingredients? Is someone making something?",
        iconEmoji: "🍳",
        dayOffset: 5,
        hourOffset: 18  // 6pm
    },

    // Day 7 — dayOffset 6 (Thu Apr 2) — Chapter 3 already out
    {
        id: "mu_010",
        type: "story",
        title: "Mystery Deepens",
        message: "Why would Fergus care about ingredients? The Easter Bunny is confused...",
        iconEmoji: "🤔",
        dayOffset: 6,
        hourOffset: 9  // 9am
    },

    // Day 8 — dayOffset 7 (Fri Apr 3)
    {
        id: "mu_012",
        type: "hint",
        title: "Almost There",
        message: "Keep collecting eggs! The more Codex letters we unlock, the more clues we can read!",
        iconEmoji: "🔑",
        dayOffset: 7,
        hourOffset: 9  // 9am
    },

    // Day 9 — dayOffset 8 (Sat Apr 4) — Easter Eve
    {
        id: "mu_011",
        type: "community",
        title: "Easter Eve!",
        message: "Tomorrow is Easter Sunday! Can we solve the mystery in time?",
        iconEmoji: "🌙",
        dayOffset: 8,
        hourOffset: 9  // 9am
    },

    // Day 10 — dayOffset 9 (Sun Apr 5) — Easter Sunday
    // Chapter 4 available at 8am, Golden Egg available
    // IMPORTANT: No update reveals "simnel cake" before 6pm
    {
        id: "mu_013",
        type: "special",
        title: "Happy Easter!",
        message: "It's Easter Sunday! Thanks to all the children who helped, the eggs have been collected and Easter Egg hunts can go ahead! You did it!",
        iconEmoji: "🐰",
        dayOffset: 9,
        hourOffset: 9  // 9am
    },
    {
        id: "mu_014",
        type: "special",
        title: "Golden Egg Alert!",
        message: "A mysterious GOLDEN EGG has appeared! Could it hold the answer to the mystery?",
        iconEmoji: "🌟",
        dayOffset: 9,
        hourOffset: 10  // 10am
    },
    {
        id: "mu_015",
        type: "special",
        title: "The Mystery Revealed",
        message: "Children who found the Golden Egg have discovered that the ingredients spell out a recipe for a Simnel Cake! But that's not all — inside the egg was a strange new clue: GERARDIA. What could it mean? The Easter Bunny says the case isn't closed yet... stay tuned for Part 2!",
        iconEmoji: "🎂",
        dayOffset: 9,
        hourOffset: 18  // 6pm — wraps up the day for everyone
    }
];
