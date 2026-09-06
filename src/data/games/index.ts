import { MeanGreenEggstravaganza } from './MeanGreenEggstravaganza';
import { JasmarinaBournemouth } from './JasmarinaBournemouth';
import { AnniesMurderBournemouth } from './AnniesMurderBournemouth';
import { MatildasSpring } from './MatildasSpring';
import { BryngarwMeadowSpring } from './BryngarwMeadowSpring';
import { BryngarwMeadowSummer } from './BryngarwMeadowSummer';
import { BryngarwRiverSpring } from './BryngarwRiverSpring';
import { BryngarwRiverSummer } from './BryngarwRiverSummer';
import { BryngarwWoodlandSummer } from './BryngarwWoodlandSummer';
import { EggstraordinaryCardiff } from './EggstraordinaryCardiff';
import { EggstraordinaryFrome } from './EggstraordinaryFrome';
import { EasterEvent } from './EasterEvent';
import { WhatTheHeathWasWatching } from './WhatTheHeathWasWatching';

// Helper to get all trails (including EVENT type games)
export const Trails = [
    MeanGreenEggstravaganza,
    JasmarinaBournemouth,
    AnniesMurderBournemouth,
    MatildasSpring,
    BryngarwMeadowSpring,
    BryngarwMeadowSummer,
    BryngarwRiverSpring,
    BryngarwRiverSummer,
    BryngarwWoodlandSummer,
    EggstraordinaryCardiff,
    EggstraordinaryFrome,
    EasterEvent,
    WhatTheHeathWasWatching
];

export const getStoredTrails = () => Trails;
