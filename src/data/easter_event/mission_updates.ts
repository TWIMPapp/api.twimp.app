import { MissionUpdate } from '../../types/EasterEventTypes';

// Mission updates for the Easter Event news feed
// Filtered by date only (no puzzle/progress dependencies)
// These appear in reverse chronological order (newest first)

export const MISSION_UPDATES: MissionUpdate[] = [
    // Day 1
    {
        id: "mu_001",
        type: "story",
        title: "Mission Begins!",
        message: "Children across the nation have joined the search for the missing eggs! The Easter Bunny is counting on us!",
        iconEmoji: "🔍",
        dayOffset: 0
    },
    {
        id: "mu_002",
        type: "hint",
        title: "Strange Symbols",
        message: "Some children are reporting strange symbols on the eggs. What could they mean?",
        iconEmoji: "❓",
        dayOffset: 0,
        hourOffset: 14  // 2pm
    },

    // Day 2
    {
        id: "mu_003",
        type: "community",
        title: "Egg Count Rising!",
        message: "Over 1,000 eggs have been collected nationwide! Keep searching!",
        iconEmoji: "📈",
        dayOffset: 1
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

    // Day 3
    {
        id: "mu_005",
        type: "community",
        title: "5,000 Eggs!",
        message: "We've passed 5,000 eggs collected! The Easter Bunny is amazed by your help!",
        iconEmoji: "🎉",
        dayOffset: 2
    },

    // Day 4
    {
        id: "mu_006",
        type: "story",
        title: "Clue Found!",
        message: "The Easter Bunny has found a purple glove at the warehouse! A suspect emerges...",
        iconEmoji: "🧤",
        dayOffset: 3
    },
    {
        id: "mu_007",
        type: "hint",
        title: "Codex Confirmed",
        message: "It's confirmed - the symbols ARE letters! Build your Codex to decode the clues!",
        iconEmoji: "📜",
        dayOffset: 3,
        hourOffset: 12  // Noon
    },

    // Day 5
    {
        id: "mu_008",
        type: "community",
        title: "10,000 Eggs!",
        message: "Incredible! 10,000 eggs collected! You're all amazing egg hunters!",
        iconEmoji: "🏆",
        dayOffset: 4
    },
    {
        id: "mu_009",
        type: "hint",
        title: "Recipe Theory",
        message: "The decoded clues seem to be... ingredients? Is someone making something?",
        iconEmoji: "🍳",
        dayOffset: 4,
        hourOffset: 18  // 6pm
    },

    // Day 6
    {
        id: "mu_010",
        type: "story",
        title: "Mystery Deepens",
        message: "Fergus can't cook, so why would he need ingredients? The Easter Bunny is confused...",
        iconEmoji: "🤔",
        dayOffset: 5
    },

    // Day 7
    {
        id: "mu_011",
        type: "community",
        title: "Easter Eve!",
        message: "Tomorrow is Easter Sunday! Can we solve the mystery in time?",
        iconEmoji: "🌙",
        dayOffset: 6
    },
    {
        id: "mu_012",
        type: "hint",
        title: "Almost There",
        message: "Keep collecting eggs! The more Codex letters we unlock, the more clues we can read!",
        iconEmoji: "🔑",
        dayOffset: 6,
        hourOffset: 15  // 3pm
    },

    // Day 8 - Easter Sunday
    {
        id: "mu_013",
        type: "special",
        title: "Happy Easter!",
        message: "It's Easter Sunday! Thanks to all the children who helped save Easter!",
        iconEmoji: "🐰",
        dayOffset: 7
    },
    {
        id: "mu_014",
        type: "special",
        title: "Golden Egg Alert!",
        message: "A mysterious GOLDEN EGG has appeared! Could it hold the answer to the mystery?",
        iconEmoji: "🌟",
        dayOffset: 7,
        hourOffset: 10  // 10am
    }
];
