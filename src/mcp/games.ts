// Helpers for reading the TWIMP game list directly from the backend's own
// services. Used by the MCP HTTP server in api/mcp.ts.
//
// We don't go through /api/list because:
//  1. We're inside the same backend — direct service calls are faster
//  2. We get access to richer data than the public list endpoint exposes

import { TrailService } from '../services/TrailService';
import { GameConfigService, GameStatus } from '../services/GameConfigService';
import type { Trail } from '../types/index';

export interface GameSummary {
  ref: string;
  name: string;
  description: string;
  image_url?: string | null;
  lat: number | null;
  lng: number | null;
  status: GameStatus;
  type?: string;
  // Eventbrite template event id (from game_config.eventbrite_template_id).
  // Null when no template is configured for this game.
  eventbrite_template_id: string | null;
}

function summariseTrail(
  t: Trail,
  status: GameStatus,
  eventbriteTemplateId: string | null,
): GameSummary {
  // EVENT games (content_pack) have no physical start location
  const isEvent = t.type === 'EVENT' || !!t.content_pack;
  const firstStepLocationId = t.steps?.[0]?.locationId;
  const startLocation = firstStepLocationId
    ? t.locations?.find(loc => loc.id === firstStepLocationId)
    : t.locations?.[0];

  return {
    ref: t.ref,
    name: t.name,
    description: t.description ?? '',
    image_url: t.image_url ?? null,
    lat: isEvent ? null : (startLocation?.lat ?? null),
    lng: isEvent ? null : (startLocation?.lng ?? null),
    status,
    type: t.type,
    eventbrite_template_id: eventbriteTemplateId,
  };
}

// All games with a row in game_config (status active, featured, or pending).
// 'inactive' games are excluded. 'pending' games are included so the sync
// report can warn about Eventbrite events that exist for not-yet-playable games.
export async function getAllVisibleGames(): Promise<GameSummary[]> {
  // Refresh dynamic trails to pick up any recent Supabase changes
  await (TrailService as any).refreshDynamicTrails?.();

  const allTrails = TrailService.getAllTrails();
  const configs = await GameConfigService.getAll();
  const configByRef = new Map(configs.map(c => [c.ref, c]));

  const summaries: GameSummary[] = [];
  for (const t of allTrails) {
    const cfg = configByRef.get(t.ref);
    if (!cfg || cfg.status === 'inactive') continue;
    summaries.push(summariseTrail(t, cfg.status, cfg.eventbriteTemplateId));
  }
  return summaries;
}

// Only games that are actually playable (active or featured).
// These are the ones that should have Eventbrite events.
export async function getLiveGames(): Promise<GameSummary[]> {
  const all = await getAllVisibleGames();
  return all.filter(g => g.status === 'active' || g.status === 'featured');
}

export async function getGameByRef(ref: string): Promise<GameSummary | null> {
  const all = await getAllVisibleGames();
  return all.find(g => g.ref === ref) || null;
}
