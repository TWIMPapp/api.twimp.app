import { Puzzle } from '../../types/EasterEventTypes';

// Daily puzzles for the Easter Event
// Each puzzle is available for 48 hours
// Correct answer awards 2 rare codex letters

export const PUZZLES: Puzzle[] = [
    {
        id: 1,
        title: "The Egg Counter",
        startDayOffset: 0,      // Day 1-2
        durationHours: 48,
        image: "puzzle1.png",
        hint: "Count carefully and think about the pattern!",
        answer: "twelve",
        rewardLetters: ['Q', 'K']
    },
    {
        id: 2,
        title: "The Bunny Trail",
        startDayOffset: 2,      // Day 3-4
        durationHours: 48,
        image: "puzzle2.png",
        hint: "Follow the path and count the hops!",
        answer: "seven",
        rewardLetters: ['V', 'W']
    },
    {
        id: 3,
        title: "The Hidden Message",
        startDayOffset: 4,      // Day 5-6
        durationHours: 48,
        image: "puzzle3.png",
        hint: "Look at the first letter of each word...",
        answer: "spring",
        rewardLetters: ['X', 'U']
    },
    {
        id: 4,
        title: "The Final Riddle",
        startDayOffset: 6,      // Day 7-8 (Thu Apr 2)
        durationHours: 48,
        image: "puzzle4.png",
        hint: "What comes once in a year, twice in a week, but never in a day?",
        answer: "e",
        rewardLetters: ['J', 'F']
    },
    {
        id: 5,
        title: "The Golden Challenge",
        startDayOffset: 8,      // Day 9-10 (Easter Saturday Apr 4)
        durationHours: 48,
        image: "puzzle5.png",
        hint: "The final piece of the puzzle awaits...",
        answer: "bunny",
        rewardLetters: ['Z', 'G']
    }
];
