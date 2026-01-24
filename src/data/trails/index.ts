import { MeanGreenEggstravaganza } from './MeanGreenEggstravaganza.js';
import { JasmarinaBournemouth } from './JasmarinaBournemouth.js';
import { MatildasSpring } from './MatildasSpring.js';
import { BryngarwMeadowSpring } from './BryngarwMeadowSpring.js';
import { BryngarwMeadowSummer } from './BryngarwMeadowSummer.js';
import { BryngarwRiverSpring } from './BryngarwRiverSpring.js';
import { BryngarwRiverSummer } from './BryngarwRiverSummer.js';
import { BryngarwWoodlandSummer } from './BryngarwWoodlandSummer.js';
import { EggstraordinaryCardiff } from './EggstraordinaryCardiff.js';
import { EggstraordinaryFrome } from './EggstraordinaryFrome.js';
import { EggHunt } from './EggHunt.js';
import { EasterEvent } from './EasterEvent.js';

// Helper to get all trails (including EVENT type games)
export const Trails = [
    MeanGreenEggstravaganza,
    JasmarinaBournemouth,
    MatildasSpring,
    BryngarwMeadowSpring,
    BryngarwMeadowSummer,
    BryngarwRiverSpring,
    BryngarwRiverSummer,
    BryngarwWoodlandSummer,
    EggstraordinaryCardiff,
    EggstraordinaryFrome,
    EggHunt,
    EasterEvent
];

export const getStoredTrails = () => Trails;
