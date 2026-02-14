// Jurassic Coast Dino Egg Hunt - Static Game Data
// Created by Ethan & Mr David Peanut
// 10 categories, 30 dinosaurs, 10 trivia questions

import { DinoCategory, DinoCategoryId } from '../types/DinoHuntTypes';

export const DINO_HUNT_CONFIG = {
    TOTAL_EGGS: 10,
    SPAWN_RADIUS_METERS: 300,
    MIN_SPAWN_DISTANCE_METERS: 50,
    COLLECTION_RADIUS_METERS: 20,  // ~30m empirically
    MAX_NICKNAME_LENGTH: 20,
};

export const FAVORITE_DINO_OPTIONS = [
    { id: 'trex', name: 'T-Rex' },
    { id: 'triceratops', name: 'Triceratops' },
    { id: 'velociraptor', name: 'Velociraptor' },
    { id: 'stegosaurus', name: 'Stegosaurus' },
    { id: 'brachiosaurus', name: 'Brachiosaurus' },
    { id: 'pteranodon', name: 'Pteranodon' },
];

export const DINO_CATEGORIES: DinoCategory[] = [
    {
        id: 'fastest',
        name: 'The Fastest',
        emoji: '💨',
        eggColor: '#EAB308',  // Yellow
        question: {
            text: 'How fast could the fastest dinosaurs run?',
            options: [
                { label: '40 mph', rarity: 'epic' },
                { label: '25 mph', rarity: 'rare' },
                { label: '3 mph - same as a tortoise!', rarity: 'common' },
            ],
        },
        dinosaurs: {
            epic:   { name: 'Velociraptor',    rarity: 'epic',   stats: { speed: 10, size: 2, strength: 3, intelligence: 8, defence: 3, aggression: 9 }, total: 35 },
            rare:   { name: 'Gallimimus',      rarity: 'rare',   stats: { speed: 8,  size: 4, strength: 1, intelligence: 3, defence: 1, aggression: 1 }, total: 18 },
            common: { name: 'Dromiceiomimus',  rarity: 'common', stats: { speed: 5,  size: 1, strength: 1, intelligence: 2, defence: 1, aggression: 1 }, total: 11 },
        },
    },
    {
        id: 'aggressive',
        name: 'The Most Aggressive',
        emoji: '😡',
        eggColor: '#EF4444',  // Red
        question: {
            text: 'How many teeth did a T-Rex have?',
            options: [
                { label: '60 teeth', rarity: 'epic' },
                { label: '120 teeth', rarity: 'rare' },
                { label: 'Just 2 - like a bunny rabbit!', rarity: 'common' },
            ],
        },
        dinosaurs: {
            epic:   { name: 'Majungasaurus',     rarity: 'epic',   stats: { speed: 5, size: 5, strength: 8, intelligence: 3, defence: 3, aggression: 10 }, total: 34 },
            rare:   { name: 'Allosaurus',        rarity: 'rare',   stats: { speed: 6, size: 6, strength: 6, intelligence: 5, defence: 2, aggression: 8 },  total: 33 },
            common: { name: 'Proceratosaurus',   rarity: 'common', stats: { speed: 5, size: 3, strength: 3, intelligence: 2, defence: 2, aggression: 5 },  total: 20 },
        },
    },
    {
        id: 'deadliest',
        name: 'The Deadliest',
        emoji: '💀',
        eggColor: '#1F2937',  // Black/dark
        question: {
            text: 'How heavy was a T-Rex?',
            options: [
                { label: '9 tonnes', rarity: 'epic' },
                { label: '20 tonnes', rarity: 'rare' },
                { label: '50kg - same as a Labrador!', rarity: 'common' },
            ],
        },
        dinosaurs: {
            epic:   { name: 'T-Rex',           rarity: 'epic',   stats: { speed: 6, size: 9,  strength: 10, intelligence: 6, defence: 3, aggression: 9 }, total: 43 },
            rare:   { name: 'Giganotosaurus',  rarity: 'rare',   stats: { speed: 5, size: 8,  strength: 10, intelligence: 3, defence: 2, aggression: 9 }, total: 37 },
            common: { name: 'Spinosaurus',     rarity: 'common', stats: { speed: 7, size: 9,  strength: 8,  intelligence: 3, defence: 2, aggression: 5 }, total: 34 },
        },
    },
    {
        id: 'weirdest',
        name: 'The Weirdest',
        emoji: '🤪',
        eggColor: '#A855F7',  // Purple
        question: {
            text: 'How long were Therizinosaurus claws?',
            options: [
                { label: '90 cm', rarity: 'epic' },
                { label: '30 cm', rarity: 'rare' },
                { label: '10 metres - longer than a bus!', rarity: 'common' },
            ],
        },
        dinosaurs: {
            epic:   { name: 'Therizinosaurus',    rarity: 'epic',   stats: { speed: 2, size: 6, strength: 6, intelligence: 2, defence: 6, aggression: 2 }, total: 24 },
            rare:   { name: 'Amargasaurus',       rarity: 'rare',   stats: { speed: 2, size: 6, strength: 3, intelligence: 2, defence: 4, aggression: 1 }, total: 18 },
            common: { name: 'Pachycephalosaurus',  rarity: 'common', stats: { speed: 4, size: 2, strength: 3, intelligence: 2, defence: 3, aggression: 2 }, total: 16 },
        },
    },
    {
        id: 'sea',
        name: 'The Sea Creatures',
        emoji: '🌊',
        eggColor: '#3B82F6',  // Blue
        question: {
            text: 'How long was the biggest sea reptile?',
            options: [
                { label: '21 metres', rarity: 'epic' },
                { label: '10 metres', rarity: 'rare' },
                { label: '30 centimetres - like a goldfish!', rarity: 'common' },
            ],
        },
        dinosaurs: {
            epic:   { name: 'Pliosaur',      rarity: 'epic',   stats: { speed: 7, size: 8, strength: 9, intelligence: 4, defence: 4, aggression: 9 }, total: 41 },
            rare:   { name: 'Nothosaurus',   rarity: 'rare',   stats: { speed: 6, size: 4, strength: 5, intelligence: 3, defence: 3, aggression: 6 }, total: 27 },
            common: { name: 'Ichthyosaur',   rarity: 'common', stats: { speed: 8, size: 3, strength: 3, intelligence: 3, defence: 2, aggression: 3 }, total: 22 },
        },
    },
    {
        id: 'flying',
        name: 'The Flyers',
        emoji: '🦅',
        eggColor: '#38BDF8',  // Sky blue
        question: {
            text: 'What was the biggest wingspan of a flying reptile?',
            options: [
                { label: '11 metres', rarity: 'epic' },
                { label: '5 metres', rarity: 'rare' },
                { label: '20 centimetres - like a sparrow!', rarity: 'common' },
            ],
        },
        dinosaurs: {
            epic:   { name: 'Quetzalcoatlus', rarity: 'epic',   stats: { speed: 7, size: 7, strength: 5, intelligence: 4, defence: 2, aggression: 5 }, total: 30 },
            rare:   { name: 'Pteranodon',     rarity: 'rare',   stats: { speed: 8, size: 4, strength: 3, intelligence: 3, defence: 1, aggression: 4 }, total: 23 },
            common: { name: 'Dimorphodon',    rarity: 'common', stats: { speed: 6, size: 1, strength: 2, intelligence: 2, defence: 1, aggression: 4 }, total: 16 },
        },
    },
    {
        id: 'smartest',
        name: 'The Smartest',
        emoji: '🧠',
        eggColor: '#22C55E',  // Green
        question: {
            text: 'How many million years ago did dinosaurs go extinct?',
            options: [
                { label: '66 million', rarity: 'epic' },
                { label: '150 million', rarity: 'rare' },
                { label: 'Last Tuesday!', rarity: 'common' },
            ],
        },
        dinosaurs: {
            epic:   { name: 'Velociraptor',   rarity: 'epic',   stats: { speed: 10, size: 2, strength: 3, intelligence: 8, defence: 3, aggression: 9 }, total: 35 },
            rare:   { name: 'Dilophosaurus',  rarity: 'rare',   stats: { speed: 6,  size: 5, strength: 5, intelligence: 5, defence: 2, aggression: 4 }, total: 27 },
            common: { name: 'Diplodocus',     rarity: 'common', stats: { speed: 2,  size: 9, strength: 4, intelligence: 2, defence: 2, aggression: 1 }, total: 20 },
        },
    },
    {
        id: 'biggest',
        name: 'The Biggest',
        emoji: '🏔️',
        eggColor: '#F97316',  // Orange
        question: {
            text: 'How long was the biggest dinosaur?',
            options: [
                { label: '35 metres', rarity: 'epic' },
                { label: '15 metres', rarity: 'rare' },
                { label: '1 metre - like a dog!', rarity: 'common' },
            ],
        },
        dinosaurs: {
            epic:   { name: 'Argentinosaurus', rarity: 'epic',   stats: { speed: 1, size: 10, strength: 7, intelligence: 2, defence: 4, aggression: 2 }, total: 26 },
            rare:   { name: 'Brachiosaurus',   rarity: 'rare',   stats: { speed: 2, size: 9,  strength: 5, intelligence: 2, defence: 3, aggression: 1 }, total: 22 },
            common: { name: 'Apatosaurus',     rarity: 'common', stats: { speed: 2, size: 8,  strength: 4, intelligence: 2, defence: 3, aggression: 1 }, total: 20 },
        },
    },
    {
        id: 'armoured',
        name: 'The Armoured',
        emoji: '🛡️',
        eggColor: '#6B7280',  // Grey
        question: {
            text: 'How long did dinosaurs live on Earth?',
            options: [
                { label: '165 million years', rarity: 'epic' },
                { label: '50 million years', rarity: 'rare' },
                { label: '2 weeks!', rarity: 'common' },
            ],
        },
        dinosaurs: {
            epic:   { name: 'Ankylosaurus',  rarity: 'epic',   stats: { speed: 2, size: 5, strength: 7, intelligence: 2, defence: 10, aggression: 5 }, total: 31 },
            rare:   { name: 'Borealopelta',  rarity: 'rare',   stats: { speed: 2, size: 4, strength: 4, intelligence: 2, defence: 8,  aggression: 3 }, total: 23 },
            common: { name: 'Nodosaurus',    rarity: 'common', stats: { speed: 2, size: 4, strength: 3, intelligence: 2, defence: 6,  aggression: 2 }, total: 19 },
        },
    },
    {
        id: 'horns_spikes',
        name: 'Horns & Spikes',
        emoji: '🦏',
        eggColor: '#92400E',  // Brown
        question: {
            text: "How long was Triceratops's longest horn?",
            options: [
                { label: '100 cm', rarity: 'epic' },
                { label: '40 cm', rarity: 'rare' },
                { label: '50 metres - taller than Big Ben!', rarity: 'common' },
            ],
        },
        dinosaurs: {
            epic:   { name: 'Styracosaurus',  rarity: 'epic',   stats: { speed: 4, size: 5, strength: 7, intelligence: 3, defence: 9, aggression: 7 }, total: 35 },
            rare:   { name: 'Triceratops',    rarity: 'rare',   stats: { speed: 4, size: 6, strength: 7, intelligence: 3, defence: 7, aggression: 5 }, total: 32 },
            common: { name: 'Protoceratops',  rarity: 'common', stats: { speed: 4, size: 2, strength: 3, intelligence: 3, defence: 4, aggression: 4 }, total: 20 },
        },
    },
];

export function getCategoryById(id: DinoCategoryId): DinoCategory | undefined {
    return DINO_CATEGORIES.find(c => c.id === id);
}

// Reveal messages based on rarity
export const RARITY_MESSAGES: Record<string, string> = {
    epic: 'EPIC! You awakened a legendary dinosaur!',
    rare: 'RARE! You awakened a powerful dinosaur!',
    common: "COMMON! You awakened a dinosaur... it's a bit confused but willing to help!",
};

// Intro story template — {FAVOURITE_DINO} gets replaced with player's choice
export const INTRO_STORY = `A baby {FAVOURITE_DINO} has been captured!

The evil Dr. Fossilus, a horrible paleontologist, has taken the baby to his secret lair. He plans to use his mind-control device to turn this innocent creature into a soldier for his army of controlled dinosaurs.

You are the only one who can save it.

But you can't do it alone. You must gather an army of dinosaurs willing to help you. Ancient eggs have been scattered across the land — each one containing a dinosaur spirit waiting to be awakened.

Find all 10 eggs. Answer the ancient riddles. Build your army.

Then... face Dr. Fossilus and rescue the baby {FAVOURITE_DINO}!`;
