// Trail-creator tools for the MCP server. These wrap CustomTrailService
// directly (in-process — same backend that hosts the HTTP API), so we skip
// the HTTP round-trip the old twimp-mcp/ stdio server used to do.
//
// Auth model: a single TWIMP_CREATOR_KEY env var on the backend identifies
// the creator. It's a regular API key (same shape as the ones issued via
// ApiKeyService), so it carries any per-key game limits with it. The
// outer MCP bearer (MCP_TOKEN, checked in api/mcp.ts) is what authenticates
// the request itself — TWIMP_CREATOR_KEY just tells the trail logic *who*
// the creator is.
//
// Mirrors the auth flow in backend/api/custom-trail/*.ts so the MCP tools
// behave like an authenticated HTTP client would.
//
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- service
// methods are typed as `any` upstream for now.

import { CustomTrailService } from '../services/CustomTrailService';
import { ApiKeyService } from '../services/ApiKeyService';

export interface CreatorContext {
  creator_id: string;
  max_active_games?: number;
  max_total_games?: number;
}

/**
 * Resolve the configured creator key to a creator_id + per-key game limits.
 * Throws if TWIMP_CREATOR_KEY is unset or the key is invalid — let the tool
 * wrapper turn the exception into an MCP error message.
 */
async function resolveCreator(): Promise<CreatorContext> {
  const key = process.env.TWIMP_CREATOR_KEY;
  if (!key) {
    throw new Error('TWIMP_CREATOR_KEY is not configured on the backend');
  }
  const result = await ApiKeyService.validateKey(key);
  if (!result.valid || !result.creator_id) {
    throw new Error('TWIMP_CREATOR_KEY is invalid or inactive');
  }
  return {
    creator_id: result.creator_id,
    max_active_games: result.max_active_games,
    max_total_games: result.max_total_games,
  };
}

export interface RandomTrailParams {
  start_location: { lat: number; lng: number };
  count: number;
  theme: 'easter' | 'valentine' | 'general';
  name?: string;
  competitive: boolean;
  spawn_radius: number;
}

export async function createRandomTrail(params: RandomTrailParams) {
  const creator = await resolveCreator();
  const pins = CustomTrailService.generateRandomPins(
    params.start_location,
    params.count,
    false, // has_questions — random trails are quick hunts, no questions
    params.theme,
    params.spawn_radius
  );
  return CustomTrailService.createTrail(
    creator.creator_id,
    params.theme,
    params.name,
    params.start_location,
    pins,
    'random',
    { competitive: params.competitive, hotCold: false },
    { maxActive: creator.max_active_games, maxTotal: creator.max_total_games }
  );
}

export interface CustomTrailPin {
  lat: number;
  lng: number;
  icon?: string;
  colour?: string;
  question?: string;
  answer?: string;
  successMessage?: string;
}

export interface CustomTrailParams {
  start_location: { lat: number; lng: number };
  pins: CustomTrailPin[];
  theme: 'easter' | 'valentine' | 'general';
  name?: string;
  competitive: boolean;
}

export async function createCustomTrail(params: CustomTrailParams) {
  const creator = await resolveCreator();
  return CustomTrailService.createTrail(
    creator.creator_id,
    params.theme,
    params.name,
    params.start_location,
    params.pins as any,
    'custom',
    { competitive: params.competitive, hotCold: false },
    { maxActive: creator.max_active_games, maxTotal: creator.max_total_games }
  );
}

export async function getTrailDetails(trailId: string) {
  const creator = await resolveCreator();
  // Creator view returns the full trail + player positions; this is the same
  // call /api/custom-trail/[id]?creator_id=… makes.
  return CustomTrailService.getCreatorView(trailId, creator.creator_id);
}

export async function getMyTrails() {
  const creator = await resolveCreator();
  const trails = await CustomTrailService.getTrailsByCreator(creator.creator_id);
  return trails.map((trail: any) => ({
    id: trail.id,
    name: trail.name,
    theme: trail.theme,
    pinCount: trail.pins?.length ?? trail.dynamicConfig?.count ?? 0,
    mode: trail.mode,
    settings: trail.settings,
    playCount: trail.playCount,
    createdAt: trail.createdAt,
    expiresAt: trail.expiresAt,
    isActive: trail.isActive,
  }));
}

export async function stopTrail(trailId: string, expire = true) {
  const creator = await resolveCreator();
  return CustomTrailService.deleteTrail(creator.creator_id, trailId, expire);
}
