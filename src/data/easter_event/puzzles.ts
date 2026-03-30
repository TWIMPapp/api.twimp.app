import { Puzzle } from '../../types/EasterEventTypes';

// Daily puzzles for the Easter Event
// Each puzzle is available for 24 hours
// Correct answer awards 1 rare codex letter
// Reward letter order: Q, K, V, W, J, F, X, U, Z, G

export const PUZZLES: Puzzle[] = [
    {
        id: 1,
        title: "Day 1",
        startDayOffset: 0,
        durationHours: 24,
        component: { name: "Wordle", answer: "CLUES" },
        rewardLetters: ['Q']
    },
    {
        id: 2,
        title: "Day 2",
        startDayOffset: 1,
        durationHours: 24,
        component: { name: "Wordle", answer: "HINTS" },
        rewardLetters: ['K']
    },
    {
        id: 3,
        title: "Day 3",
        startDayOffset: 2,
        durationHours: 24,
        component: { name: "Wordle", answer: "BUNNY" },
        rewardLetters: ['V']
    },
    {
        id: 4,
        title: "Day 4",
        startDayOffset: 3,
        durationHours: 24,
        component: { name: "Wordle", answer: "TRAIL" },
        rewardLetters: ['W']
    },
    {
        id: 5,
        title: "Day 5",
        startDayOffset: 4,
        durationHours: 24,
        component: { name: "Wordle", answer: "CHICK" },
        rewardLetters: ['J']
    },
    {
        id: 6,
        title: "Day 6",
        startDayOffset: 5,
        durationHours: 24,
        component: { name: "Wordle", answer: "HATCH" },
        rewardLetters: ['F']
    },
    {
        id: 7,
        title: "Day 7",
        startDayOffset: 6,
        durationHours: 24,
        component: { name: "Wordle", answer: "NESTS" },
        rewardLetters: ['X']
    },
    {
        id: 8,
        title: "Day 8",
        startDayOffset: 7,
        durationHours: 24,
        component: { name: "Wordle", answer: "FEAST" },
        rewardLetters: ['U']
    },
    {
        id: 9,
        title: "Day 9",
        startDayOffset: 8,
        durationHours: 24,
        component: { name: "Wordle", answer: "SOLVE" },
        rewardLetters: ['Z']
    },
    {
        id: 10,
        title: "Day 10",
        startDayOffset: 9,
        durationHours: 24,
        component: { name: "Wordle", answer: "FALSE" },
        rewardLetters: ['G']
    }
];
