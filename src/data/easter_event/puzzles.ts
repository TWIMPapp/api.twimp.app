import { Puzzle } from '../../types/EasterEventTypes';

// Daily puzzles for the Easter Event
// Each puzzle is available for 24 hours
// Correct answer awards 1 rare codex letter
// Puzzles can be text-based (hint/answer) or component-based (Wordle, etc.)

export const PUZZLES: Puzzle[] = [
    {
        id: 1,
        title: "Ready, Steady, Wordle",
        startDayOffset: 0,      // Day 1 (Fri Mar 27)
        durationHours: 24,
        component: {
            name: "Wordle",
            answer: "CLUES"
        },
        answer: "clues",
        rewardLetters: ['Q']
    }
    // More daily puzzles to be added for Days 2-10
];
