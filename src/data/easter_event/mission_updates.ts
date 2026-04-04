import { MissionUpdate } from '../../types/EasterEventTypes';

// Mission updates for the Easter Event news feed
// Filtered by date only (no puzzle/progress dependencies)
// These appear in reverse chronological order (newest first)
//
// Timeline: Event starts April 3 (dayOffset 0), ends April 12 (dayOffset 9)
// Rule: No mission update before 9am (hourOffset >= 9)
// Rule: No update should reveal information before its corresponding chapter

export const MISSION_UPDATES: MissionUpdate[] = [
    // Day 1 — dayOffset 0 (Thu Apr 3) — Chapter 1 available at 8am
    {
        id: "mu_001",
        type: "story",
        title: "Mission Begins!",
        message: "Easter Sunday was ruined, but the holidays aren't over! Children across the nation have joined the search for the missing eggs!",
        iconEmoji: "🔍",
        dayOffset: 0,
        hourOffset: 15
    },
    {
        id: "mu_002",
        type: "hint",
        title: "Strange Symbols",
        message: "Some children are reporting strange symbols on the eggs. What could they mean?",
        iconEmoji: "❓",
        dayOffset: 0,
        hourOffset: 18
    },

    // Day 2 — dayOffset 1 (Fri Apr 4)
    {
        id: "mu_003",
        type: "community",
        title: "Egg Count Rising!",
        message: "Over 1,000 eggs have been collected nationwide! Keep searching!",
        iconEmoji: "📈",
        dayOffset: 1,
        hourOffset: 9
    },
    {
        id: "mu_004",
        type: "hint",
        title: "Community Theory",
        message: "Some players are suggesting the symbols might be a secret alphabet...",
        iconEmoji: "💡",
        dayOffset: 1,
        hourOffset: 16
    },

    // Day 3 — dayOffset 2 (Sat Apr 5) — Chapter 2 available at 8am
    {
        id: "mu_005",
        type: "community",
        title: "5,000 Eggs!",
        message: "We've passed 5,000 eggs collected! The Easter Bunny is amazed by your help!",
        iconEmoji: "🎉",
        dayOffset: 2,
        hourOffset: 9
    },

    // Day 4 — dayOffset 3 (Sun Apr 6) — Chapter 2 already out, purple glove safe to reference
    {
        id: "mu_006",
        type: "story",
        title: "Clue Found!",
        message: "The Easter Bunny has found a purple glove at the warehouse! A suspect emerges...",
        iconEmoji: "🧤",
        dayOffset: 3,
        hourOffset: 9
    },

    // Day 5 — dayOffset 4 (Mon Apr 7)
    {
        id: "mu_008",
        type: "community",
        title: "10,000 Eggs!",
        message: "Incredible! 10,000 eggs collected! You're all amazing egg hunters!",
        iconEmoji: "🏆",
        dayOffset: 4,
        hourOffset: 9
    },

    // Day 6 — dayOffset 5 (Tue Apr 8) — Chapter 3 available at 8am
    // Codex and recipe reveals now safe (Chapter 3 already out)
    {
        id: "mu_007",
        type: "hint",
        title: "Codex Confirmed",
        message: "It's confirmed - the symbols ARE letters! Build your Codex to decode the clues!",
        iconEmoji: "📜",
        dayOffset: 5,
        hourOffset: 12
    },
    {
        id: "mu_009",
        type: "hint",
        title: "Recipe Theory",
        message: "The decoded clues seem to be... ingredients? Is someone making something?",
        iconEmoji: "🍳",
        dayOffset: 5,
        hourOffset: 18
    },

    // Day 7 — dayOffset 6 (Wed Apr 9) — Chapter 3 already out
    {
        id: "mu_010",
        type: "story",
        title: "Mystery Deepens",
        message: "Why would Fergus care about ingredients? The Easter Bunny is confused...",
        iconEmoji: "🤔",
        dayOffset: 6,
        hourOffset: 9
    },

    // Day 8 — dayOffset 7 (Thu Apr 10)
    {
        id: "mu_012",
        type: "hint",
        title: "Almost There",
        message: "Keep collecting eggs! The more Codex letters we unlock, the more clues we can read!",
        iconEmoji: "🔑",
        dayOffset: 7,
        hourOffset: 9
    },

    // Day 9 — dayOffset 8 (Fri Apr 11)
    {
        id: "mu_011",
        type: "community",
        title: "Last Push!",
        message: "Tomorrow is the last day of the holidays! Can we solve the mystery in time?",
        iconEmoji: "🌙",
        dayOffset: 8,
        hourOffset: 9
    },

    // Day 10 — dayOffset 9 (Sat Apr 12) — Final day
    // Chapter 4 available at 8am, Golden Egg available
    // IMPORTANT: No update reveals "simnel cake" before 6pm
    {
        id: "mu_013",
        type: "special",
        title: "Easter Is Saved!",
        message: "Thanks to all the children who helped, the eggs have been collected and Easter Egg hunts can go ahead before the holidays end! You did it!",
        iconEmoji: "🐰",
        dayOffset: 9,
        hourOffset: 9
    },
    {
        id: "mu_014",
        type: "special",
        title: "Golden Egg Alert!",
        message: "A mysterious GOLDEN EGG has appeared! Could it hold the answer to the mystery?",
        iconEmoji: "🌟",
        dayOffset: 9,
        hourOffset: 10
    },
    {
        id: "mu_015",
        type: "special",
        title: "The Mystery Revealed",
        message: "Children who found the Golden Egg have discovered that the ingredients spell out a recipe for a Simnel Cake! But that's not all — inside the egg was a strange new clue: GERARDIA. What could it mean? The Easter Bunny says the case isn't closed yet... stay tuned for Part 2!",
        iconEmoji: "🎂",
        dayOffset: 9,
        hourOffset: 18
    }
];
