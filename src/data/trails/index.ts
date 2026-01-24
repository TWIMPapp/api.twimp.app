import { MeanGreenEggstravaganza } from './MeanGreenEggstravaganza';
import { JasmarinaBournemouth } from './JasmarinaBournemouth';
import { MatildasSpring } from './MatildasSpring';
import { BryngarwMeadowSpring } from './BryngarwMeadowSpring';
import { BryngarwMeadowSummer } from './BryngarwMeadowSummer';
import { BryngarwRiverSpring } from './BryngarwRiverSpring';
import { BryngarwRiverSummer } from './BryngarwRiverSummer';
import { BryngarwWoodlandSummer } from './BryngarwWoodlandSummer';
import { EggstraordinaryCardiff } from './EggstraordinaryCardiff';
import { EggstraordinaryFrome } from './EggstraordinaryFrome';
import { EggHunt } from './EggHunt';
import { EasterEvent } from './EasterEvent';

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
