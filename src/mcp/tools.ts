// Tool definitions for the hosted MCP server at mcp.twimp.app.
//
// Each tool is registered on an McpServer instance via registerTools().
// Both the HTTP handler (api/mcp.ts) and any future stdio wrapper call
// registerTools() against their own server, so tool implementations are
// defined exactly once.

// Type-only import — the runtime McpServer class is loaded dynamically in
// api/mcp.ts because the SDK is ESM-only and this file is compiled as CJS.
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { geocode, reverseGeocode } from './geocode';
import { getAllVisibleGames, getLiveGames, getGameByRef } from './games';
import {
  createRandomTrail,
  createCustomTrail,
  getTrailDetails,
  getMyTrails,
  stopTrail,
} from './trails';
import {
  createVenue,
  createEvent,
  createTicketClass,
  publishEvent,
  unpublishEvent,
  deleteEvent,
  listOrgEvents,
  listEventAttendees,
  setEventOverview,
  uploadImageFromUrl,
  copyEvent,
  setEventDatesAndName,
  gameRefFromTags,
  TWIMP_TAG_PREFIX,
} from './eventbrite';

const DEFAULT_TZ = 'Europe/London';
const DEFAULT_START_HOUR = 10;
const DEFAULT_END_HOUR = 22;
const DEFAULT_CAPACITY = 20;
const DEFAULT_PRICE_MINOR = 1000; // £10.00
const DEFAULT_CURRENCY = 'GBP';

// Same summary across every TWIMP event — it's a brand-level pitch, not a
// per-trail one. The trail-specific copy goes into the structured-content
// Overview (set via setEventOverview).
const TWIMP_SUMMARY = 'TWIMP is an outdoor interactive storytelling app for all the family.';

// Trail descriptions are plain text with \n\n paragraph breaks. Eventbrite's
// structured-content text module accepts HTML, so wrap each paragraph in <p>
// and turn single newlines into <br>. Escape any stray HTML in the source.
function descriptionToOverviewHtml(plain: string): string {
  const escaped = plain
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped
    .split(/\n\n+/)
    .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('');
}

function ymd(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function* dateRange(startYmd: string, days: number): Generator<string> {
  const [y, m, d] = startYmd.split('-').map(Number);
  for (let i = 0; i < days; i++) {
    const dt = new Date(Date.UTC(y, m - 1, d + i));
    yield ymd(dt);
  }
}

export function registerTools(server: McpServer): void {
  // ----- Geocoding -----

  server.tool(
    'geocode',
    'Convert a place name or address into GPS coordinates. Returns up to 5 matches via Nominatim/OpenStreetMap.',
    { query: z.string().describe('Place name, address, or landmark') },
    async ({ query }) => {
      try {
        const results = await geocode(query);
        if (results.length === 0) {
          return { content: [{ type: 'text', text: `No locations found for "${query}".` }] };
        }
        const formatted = results.map((r, i) =>
          `${i + 1}. ${r.name} (${r.type})\n   ${r.displayName}\n   Coordinates: ${r.lat}, ${r.lng}`
        ).join('\n\n');
        return { content: [{ type: 'text', text: `Found ${results.length} location(s):\n\n${formatted}` }] };
      } catch (e) {
        return { content: [{ type: 'text', text: `Geocoding error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
      }
    }
  );

  server.tool(
    'reverse_geocode',
    'Convert GPS coordinates into a human-readable place name.',
    { lat: z.number(), lng: z.number() },
    async ({ lat, lng }) => {
      try {
        const name = await reverseGeocode(lat, lng);
        return { content: [{ type: 'text', text: `Location: ${name}\nCoordinates: ${lat}, ${lng}` }] };
      } catch (e) {
        return { content: [{ type: 'text', text: `Reverse geocoding error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
      }
    }
  );

  // ----- TWIMP games -----

  server.tool(
    'list_live_games',
    'List TWIMP games currently visible on game.twimp.app. Status: active/featured = playable, pending = coming-soon teaser. Use this to find games that should have Eventbrite events.',
    {
      include_pending: z.boolean().default(false).describe('Include coming-soon games (NOT playable — must not have published Eventbrite events)'),
    },
    async ({ include_pending }) => {
      try {
        const games = include_pending ? await getAllVisibleGames() : await getLiveGames();
        if (games.length === 0) {
          return { content: [{ type: 'text', text: 'No live games on game.twimp.app right now.' }] };
        }
        const lines = games.map(g =>
          `- ${g.ref} — ${g.name} (status: ${g.status})\n  ${g.lat != null ? `${g.lat}, ${g.lng}` : 'no location (event game)'}`
        );
        return { content: [{ type: 'text', text: `${games.length} game(s):\n\n${lines.join('\n')}` }] };
      } catch (e) {
        return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
      }
    }
  );

  // ----- Trail creator -----
  //
  // Identify the creator from TWIMP_CREATOR_KEY (backend env). The outer MCP
  // bearer token already authenticated the request itself — these tools just
  // need the creator_id to pass to CustomTrailService.

  server.tool(
    'create_random_trail',
    `Create a quick treasure hunt with randomly-placed pins around a location. Pins auto-collect when the player walks up — no questions.

Use this for simple "go find them" hunts. For trails with questions, custom icons per pin, or hand-picked locations, use create_custom_trail instead.

Constraints:
- Pin count: 1-20 (recommend 5-10 for a good experience)
- Spawn radius: 100-1500 metres (default 500m, use 200-300m for walkable pub/park hunts)
- Pins must be at least 50m apart (enforced automatically)
- Each creator can only have 1 active trail at a time — if creation fails for this reason,
  use my_trails to find the active trail, then offer to stop it with stop_trail before retrying
- Competitive mode: players race — first to reach a pin claims it exclusively

Themes and their icons (pins cycle through these automatically):
- "easter": egg_red, egg_blue, egg_green, egg_gold, egg_orange, basket, treasure_chest, question_mark
- "valentine": heart_red, heart_pink, rose, love_letter, treasure_chest, question_mark
- "general": pin, treasure_chest, star, question_mark, flag

The trail is playable immediately at https://game.twimp.app/trail/{id}`,
    {
      lat: z.number().describe('Latitude of the centre point for the trail'),
      lng: z.number().describe('Longitude of the centre point for the trail'),
      count: z.number().min(1).max(20).describe('Number of pins to place (1-20)'),
      theme: z.enum(['easter', 'valentine', 'general']).default('general').describe('Visual theme for the pins'),
      name: z.string().optional().describe('Trail name (max 200 chars, shown to players)'),
      competitive: z.boolean().default(false).describe('If true, players compete — first to reach a pin claims it'),
      spawn_radius: z.number().min(100).max(1500).default(500).describe('Radius in metres to place pins (100-1500)'),
    },
    async ({ lat, lng, count, theme, name, competitive, spawn_radius }) => {
      try {
        const result = await createRandomTrail({
          start_location: { lat, lng },
          count,
          theme,
          name,
          competitive,
          spawn_radius,
        });
        if (!result.ok) {
          return { content: [{ type: 'text', text: `Failed to create trail: ${result.message || 'Unknown error'}` }], isError: true };
        }
        const id = (result as any).trail?.id;
        const playUrl = `https://game.twimp.app/trail/${id}`;
        const text =
          `Trail created.\n\n` +
          `- ID: ${id}\n` +
          `- Play URL: ${playUrl}\n` +
          `- Pins: ${count}\n` +
          `- Theme: ${theme}\n` +
          `- Radius: ${spawn_radius}m\n` +
          `- Competitive: ${competitive ? 'Yes' : 'No'}\n` +
          `\nShare this link with players: ${playUrl}`;
        return { content: [{ type: 'text', text }] };
      } catch (e) {
        return { content: [{ type: 'text', text: `Error creating trail: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
      }
    }
  );

  server.tool(
    'create_custom_trail',
    `Create a fully customised trail with hand-crafted pins. Each pin can have its own location, icon, question, and success message.

Use this when the user wants:
- Questions or trivia at each pin (quiz trails, educational hunts)
- Specific pin locations (a route past landmarks, a pub crawl, a town walk)
- Custom icons per pin to match the content or theme

AGENT GUIDANCE — crafting a great trail:
1. **Questions**: Free-text single-answer. Consider one per pin, themed around the occasion/location. Keep questions short (they display on mobile).

   IMPORTANT — answer matching is EXACT (case-insensitive, trimmed). NO fuzzy matching or synonyms.
   - Answers MUST be a single unambiguous word (e.g. "france" not "the french republic")
   - Avoid alternative spellings (e.g. "colour" vs "color")
   - Avoid numeric answers with format ambiguity (e.g. "3" vs "three", "co2" vs "carbon dioxide")
   - The question should make the expected answer format obvious
   - If in doubt, embed the choices: "Is it A) red, B) blue, or C) yellow?" → "c"

2. **Icons** (match the question or pin's purpose):
   - easter: egg_red, egg_blue, egg_green, egg_gold, egg_orange, basket, treasure_chest, question_mark
   - valentine: heart_red, heart_pink, rose, love_letter, treasure_chest, question_mark
   - general: pin, treasure_chest, star, question_mark, flag

3. **Pin placement**: Pins must be at least 50m apart. For a walking trail, space 100-300m apart along a route. The start_location should be near the first pin.

4. **Success messages**: Optional celebratory text shown when a pin is collected.

5. **Preview**: Before creating, summarise the trail for the user — list each pin with location, question (if any), and icon. Let them confirm or adjust before calling this tool.

Constraints:
- Maximum 50 pins per trail
- Each creator can only have 1 active trail at a time (use my_trails + stop_trail to clear it first)
- Trail expires after 90 days`,
    {
      start_location_lat: z.number().describe('Latitude of the trail start/meeting point'),
      start_location_lng: z.number().describe('Longitude of the trail start/meeting point'),
      name: z.string().optional().describe('Trail name (max 200 chars)'),
      theme: z.enum(['easter', 'valentine', 'general']).default('general').describe('Visual theme — sets default icons for pins without a specific icon'),
      competitive: z.boolean().default(false).describe('If true, players race — first to reach a pin claims it'),
      pins: z.string().describe('JSON array of pin objects. Each pin: { "lat": number, "lng": number, "icon"?: string, "colour"?: string, "question"?: string, "answer"?: string, "successMessage"?: string }'),
    },
    async ({ start_location_lat, start_location_lng, name, theme, competitive, pins: pinsJson }) => {
      try {
        let parsedPins: any[];
        try {
          parsedPins = JSON.parse(pinsJson);
        } catch {
          return { content: [{ type: 'text', text: 'Invalid pins JSON. Expected an array of pin objects.' }], isError: true };
        }
        if (!Array.isArray(parsedPins) || parsedPins.length === 0) {
          return { content: [{ type: 'text', text: 'pins must be a non-empty array.' }], isError: true };
        }

        const result = await createCustomTrail({
          start_location: { lat: start_location_lat, lng: start_location_lng },
          pins: parsedPins,
          theme,
          name,
          competitive,
        });
        if (!result.ok) {
          return { content: [{ type: 'text', text: `Failed to create trail: ${result.message || 'Unknown error'}` }], isError: true };
        }
        const id = (result as any).trail?.id;
        const playUrl = `https://game.twimp.app/trail/${id}`;
        const hasQuestions = parsedPins.some(p => p.question && p.answer);
        const text =
          `Trail created.\n\n` +
          `- ID: ${id}\n` +
          `- Play URL: ${playUrl}\n` +
          `- Pins: ${parsedPins.length}\n` +
          `- Theme: ${theme}\n` +
          `- Has questions: ${hasQuestions ? 'Yes' : 'No'}\n` +
          `- Competitive: ${competitive ? 'Yes' : 'No'}\n` +
          `\nShare this link with players: ${playUrl}`;
        return { content: [{ type: 'text', text }] };
      } catch (e) {
        return { content: [{ type: 'text', text: `Error creating trail: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
      }
    }
  );

  server.tool(
    'get_trail',
    'Get details about an existing trail by its ID. Returns the full creator view (pins, settings, play count, current player positions).',
    {
      id: z.string().describe('The 4-character trail ID'),
    },
    async ({ id }) => {
      try {
        const result = await getTrailDetails(id);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (e) {
        return { content: [{ type: 'text', text: `Error getting trail: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
      }
    }
  );

  server.tool(
    'my_trails',
    'List all trails created by you (identified via TWIMP_CREATOR_KEY). Shows active and inactive trails.',
    {},
    async () => {
      try {
        const trails = await getMyTrails();
        if (trails.length === 0) {
          return { content: [{ type: 'text', text: 'No trails yet.' }] };
        }
        return { content: [{ type: 'text', text: JSON.stringify(trails, null, 2) }] };
      } catch (e) {
        return { content: [{ type: 'text', text: `Error listing trails: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
      }
    }
  );

  server.tool(
    'stop_trail',
    'Deactivate an active trail. Frees the creator to make new trails. Ownership is verified server-side.',
    {
      id: z.string().describe('The 4-character trail ID to stop'),
    },
    async ({ id }) => {
      try {
        const result = await stopTrail(id);
        return { content: [{ type: 'text', text: `Trail ${id} stopped.\n${JSON.stringify(result, null, 2)}` }] };
      } catch (e) {
        return { content: [{ type: 'text', text: `Error stopping trail: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
      }
    }
  );

  // ----- Eventbrite read -----

  server.tool(
    'list_eventbrite_events',
    'List Eventbrite events under the TWIMP organisation. Returns id, name, start, status, and the TWIMP game ref via twimp_game:<ref> tag. Events without a TWIMP tag are flagged "unmanaged".',
    {
      status: z.enum(['draft', 'live', 'started', 'ended', 'all']).default('all'),
      days_ahead: z.number().min(1).max(365).default(60),
    },
    async ({ status, days_ahead }) => {
      try {
        const now = new Date();
        const end = new Date(now.getTime() + days_ahead * 86_400_000);
        const events = await listOrgEvents({
          status: status === 'all' ? undefined : status,
          startRangeStart: now.toISOString(),
          startRangeEnd: end.toISOString(),
        });
        if (events.length === 0) {
          return { content: [{ type: 'text', text: `No Eventbrite events in the next ${days_ahead} days.` }] };
        }
        const lines = events.map(e => {
          const ref = gameRefFromTags(e.tags);
          const startLocal = e.start.local.slice(0, 16).replace('T', ' ');
          return `- [${e.id}] ${e.name.text}\n  ${startLocal} ${e.start.timezone}  •  status: ${e.status}  •  game: ${ref || 'UNMANAGED (no twimp_game tag)'}`;
        });
        return { content: [{ type: 'text', text: `${events.length} event(s):\n\n${lines.join('\n')}` }] };
      } catch (e) {
        return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
      }
    }
  );

  server.tool(
    'eventbrite_sync_report',
    `Reconcile live TWIMP games against Eventbrite events for the next 30 days.

GAPS: live games missing Eventbrite events for a date → action: create + publish.
ORPHANS: Eventbrite events whose TWIMP game is no longer playable (inactive/pending/missing). Risky — customers can still book. Flagged with attendee counts; never auto-actioned.`,
    { days: z.number().min(1).max(90).default(30) },
    async ({ days }) => {
      try {
        const todayYmd = ymd(new Date());
        const liveGames = await getLiveGames();
        const allVisible = await getAllVisibleGames();
        const visibleByRef = new Map(allVisible.map(g => [g.ref, g]));

        const now = new Date();
        const end = new Date(now.getTime() + days * 86_400_000);
        const events = await listOrgEvents({
          startRangeStart: now.toISOString(),
          startRangeEnd: end.toISOString(),
        });

        const ebByGameDate = new Map<string, typeof events>();
        const unmanaged: typeof events = [];
        const orphans: Array<{ event: typeof events[0]; reason: string }> = [];

        for (const e of events) {
          const ref = gameRefFromTags(e.tags);
          const localDate = e.start.local.slice(0, 10);
          if (!ref) {
            unmanaged.push(e);
            continue;
          }
          const visible = visibleByRef.get(ref);
          if (!visible) {
            orphans.push({ event: e, reason: `game ref '${ref}' not found on game.twimp.app` });
          } else if (visible.status !== 'active' && visible.status !== 'featured') {
            orphans.push({ event: e, reason: `game '${ref}' is ${visible.status} (not playable)` });
          }
          const key = `${ref}|${localDate}`;
          if (!ebByGameDate.has(key)) ebByGameDate.set(key, []);
          ebByGameDate.get(key)!.push(e);
        }

        const gapsByGame: Record<string, string[]> = {};
        for (const game of liveGames) {
          const dates: string[] = [];
          for (const d of dateRange(todayYmd, days)) {
            if (!ebByGameDate.has(`${game.ref}|${d}`)) dates.push(d);
          }
          if (dates.length) gapsByGame[game.ref] = dates;
        }

        let report = `# Eventbrite ↔ TWIMP sync report (next ${days} days)\n\n`;
        report += `## GAPS — live games missing Eventbrite events\n\n`;
        if (Object.keys(gapsByGame).length === 0) {
          report += `All ${liveGames.length} live game(s) have full coverage.\n\n`;
        } else {
          for (const [ref, dates] of Object.entries(gapsByGame)) {
            const game = visibleByRef.get(ref);
            report += `- ${ref} (${game?.name}) — ${dates.length} missing date(s)\n`;
            report += `  ${dates.slice(0, 10).join(', ')}${dates.length > 10 ? `, …+${dates.length - 10} more` : ''}\n`;
          }
          report += `\nRun create_eventbrite_events_for_game to fill these.\n\n`;
        }

        report += `## ORPHANS — Eventbrite events for games NOT playable\n\n`;
        if (orphans.length === 0) {
          report += `No orphan events.\n\n`;
        } else {
          report += `${orphans.length} risky event(s) — customers can book a game they can't play:\n\n`;
          for (const o of orphans) {
            const e = o.event;
            let line = `- [${e.id}] ${e.name.text} (status: ${e.status})\n  ${e.start.local.slice(0, 16).replace('T', ' ')} — ${o.reason}\n  URL: ${e.url}\n`;
            if (e.status === 'live') {
              try {
                const attendees = await listEventAttendees(e.id);
                const paid = attendees.filter(a => a.status === 'Attending' || a.status === 'Checked In');
                line += `  Attendees: ${paid.length} confirmed\n`;
                if (paid.length > 0) {
                  line += `  ${paid.slice(0, 5).map(a => `${a.profile.name || a.profile.email}`).join(', ')}${paid.length > 5 ? `, …` : ''}\n`;
                }
              } catch (err: any) {
                line += `  (couldn't fetch attendees: ${err.message})\n`;
              }
            }
            report += line;
          }
          report += `\nInvestigate each one. Use unpublish_eventbrite_event or delete_eventbrite_event once decided.\n\n`;
        }

        if (unmanaged.length > 0) {
          report += `## Unmanaged events (no twimp_game tag) — left alone\n\n`;
          for (const e of unmanaged) {
            report += `- [${e.id}] ${e.name.text} (${e.start.local.slice(0, 10)}, status: ${e.status})\n`;
          }
        }

        return { content: [{ type: 'text', text: report }] };
      } catch (e) {
        return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
      }
    }
  );

  // ----- Eventbrite write -----

  server.tool(
    'create_eventbrite_events_for_game',
    `Create draft Eventbrite events for a TWIMP game across a date range. Each day: 10:00–22:00 Europe/London, capacity ${DEFAULT_CAPACITY}, single ticket class at £${(DEFAULT_PRICE_MINOR / 100).toFixed(2)}.

Creates a venue from the game's start lat/lng (reverse-geocoded for a readable address), unless venue_id is supplied. Tags each event with twimp_game:<ref>. Skips any (game_ref, date) that already has an event. Does NOT publish.`,
    {
      game_ref: z.string().describe('TWIMP game ref'),
      days: z.number().min(1).max(60).default(30),
      start_date: z.string().optional().describe('First date YYYY-MM-DD (default: today)'),
      venue_id: z.string().optional(),
      price_pennies: z.number().min(0).default(DEFAULT_PRICE_MINOR),
      capacity: z.number().min(1).max(1000).default(DEFAULT_CAPACITY),
    },
    async ({ game_ref, days, start_date, venue_id, price_pennies, capacity }) => {
      try {
        const game = await getGameByRef(game_ref);
        if (!game) {
          return { content: [{ type: 'text', text: `Game ref '${game_ref}' not found.` }], isError: true };
        }
        if (game.status !== 'active' && game.status !== 'featured') {
          return { content: [{ type: 'text', text: `Game '${game_ref}' has status '${game.status}' — not playable. Refusing to create Eventbrite events.` }], isError: true };
        }
        if (game.lat == null || game.lng == null) {
          return { content: [{ type: 'text', text: `Game '${game_ref}' has no start location (event-type game). Can't create Eventbrite venue.` }], isError: true };
        }

        const startYmd = start_date || ymd(new Date());
        const lastDate = new Date(Date.UTC(
          Number(startYmd.slice(0, 4)),
          Number(startYmd.slice(5, 7)) - 1,
          Number(startYmd.slice(8, 10)) + days,
        ));
        const existing = await listOrgEvents({
          startRangeStart: new Date(startYmd + 'T00:00:00Z').toISOString(),
          startRangeEnd: lastDate.toISOString(),
        });
        const existingDates = new Set<string>();
        for (const e of existing) {
          if (gameRefFromTags(e.tags) === game_ref) existingDates.add(e.start.local.slice(0, 10));
        }

        let venueId = venue_id;
        if (!venueId) {
          let addressLine = game.name;
          try { addressLine = await reverseGeocode(game.lat!, game.lng!); } catch { /* fall back */ }
          const venue = await createVenue({
            name: `${game.name} starting point`,
            lat: game.lat!,
            lng: game.lng!,
            addressLine,
            country: 'GB',
          });
          venueId = venue.id;
        }

        // Upload the game image once and reuse the media id across every event
        // in the batch — Eventbrite returns a persistent id we can attach as
        // each event's logo. Failure isn't fatal; events just won't have an
        // image (and the report will say so).
        let logoId: string | undefined;
        let imageError: string | undefined;
        if (game.image_url) {
          try {
            logoId = await uploadImageFromUrl(game.image_url);
          } catch (err: any) {
            imageError = err.message;
          }
        }

        const created: Array<{ date: string; eventId: string }> = [];
        const skipped: string[] = [];
        const failed: Array<{ date: string; error: string }> = [];
        const overviewFailures: Array<{ date: string; error: string }> = [];

        for (const d of dateRange(startYmd, days)) {
          if (existingDates.has(d)) { skipped.push(d); continue; }
          try {
            const startLocal = `${d}T${String(DEFAULT_START_HOUR).padStart(2, '0')}:00:00`;
            const endLocal = `${d}T${String(DEFAULT_END_HOUR).padStart(2, '0')}:00:00`;
            const ev = await createEvent({
              name: game.name,
              summary: TWIMP_SUMMARY,
              startLocal,
              endLocal,
              timezone: DEFAULT_TZ,
              currency: DEFAULT_CURRENCY,
              venueId,
              capacity,
              tags: [`${TWIMP_TAG_PREFIX}${game_ref}`],
              logoId,
            });
            await createTicketClass(ev.id, {
              name: 'Standard',
              quantityTotal: capacity,
              costMinorUnits: price_pennies || undefined,
              free: !price_pennies,
              currency: DEFAULT_CURRENCY,
            });
            // Set the trail's full description as the Overview (the "About
            // this event" body). Soft-fail: the event is created either way.
            if (game.description) {
              try {
                await setEventOverview(ev.id, descriptionToOverviewHtml(game.description));
              } catch (err: any) {
                overviewFailures.push({ date: d, error: err.message });
              }
            }
            created.push({ date: d, eventId: ev.id });
          } catch (err: any) {
            failed.push({ date: d, error: err.message });
          }
        }

        let text = `Eventbrite events for '${game_ref}'\n\n`;
        text += `Venue: ${venueId}\n`;
        text += `Image: ${logoId ? `uploaded (${logoId})` : imageError ? `FAILED — ${imageError}` : 'none on game'}\n\n`;
        text += `Created (draft): ${created.length}\n`;
        created.forEach(c => { text += `  - ${c.date} → ${c.eventId}\n`; });
        if (skipped.length) text += `\nSkipped (already exists): ${skipped.length}\n  ${skipped.join(', ')}\n`;
        if (failed.length) {
          text += `\nFailed: ${failed.length}\n`;
          failed.forEach(f => { text += `  - ${f.date}: ${f.error}\n`; });
        }
        if (overviewFailures.length) {
          text += `\nOverview set failed for ${overviewFailures.length} event(s) (event itself still created):\n`;
          overviewFailures.forEach(f => { text += `  - ${f.date}: ${f.error}\n`; });
        }
        if (created.length) text += `\nReview in the Eventbrite UI, then publish_eventbrite_event for each.\n`;
        return { content: [{ type: 'text', text }] };
      } catch (e) {
        return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
      }
    }
  );

  server.tool(
    'copy_eventbrite_event_from_template',
    `Mint a per-date Eventbrite event for a TWIMP game by COPYING the game's configured template event (game_config.eventbrite_template_id), then setting the new event's date to the supplied YYYY-MM-DD.

PREFERRED over create_eventbrite_events_for_game when a template exists — the template carries the cover image, description/overview, venue, ticket classes, refund policy, and structured-content modules that the create-from-scratch tool can't reliably set via the API. The copy starts as a draft on the template's original dates; we then PATCH it to the requested date (default 10:00–22:00 Europe/London).

Fails fast if the game has no eventbrite_template_id configured. Does NOT publish — returns the draft id for review, then call publish_eventbrite_event when ready.`,
    {
      game_ref: z.string().describe('TWIMP game ref'),
      date: z.string().describe('Target date YYYY-MM-DD (interpreted in Europe/London)'),
      start_hour: z.number().min(0).max(23).default(DEFAULT_START_HOUR).describe('Local start hour (default 10)'),
      end_hour: z.number().min(0).max(23).default(DEFAULT_END_HOUR).describe('Local end hour (default 22)'),
      timezone: z.string().default(DEFAULT_TZ).describe('IANA timezone (default Europe/London)'),
      name: z.string().optional().describe("Event title (defaults to the game's name)"),
    },
    async ({ game_ref, date, start_hour, end_hour, timezone, name }) => {
      try {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return { content: [{ type: 'text', text: `date must be YYYY-MM-DD, got '${date}'.` }], isError: true };
        }
        const game = await getGameByRef(game_ref);
        if (!game) {
          return { content: [{ type: 'text', text: `Game ref '${game_ref}' not found.` }], isError: true };
        }
        if (!game.eventbrite_template_id) {
          return { content: [{ type: 'text', text: `Game '${game_ref}' has no eventbrite_template_id configured. Set game_config.eventbrite_template_id to a template event id first, or use create_eventbrite_events_for_game.` }], isError: true };
        }

        const templateId = game.eventbrite_template_id;
        const copied = await copyEvent(templateId);
        const startLocal = `${date}T${String(start_hour).padStart(2, '0')}:00:00`;
        const endLocal = `${date}T${String(end_hour).padStart(2, '0')}:00:00`;
        const finalName = name || game.name;
        await setEventDatesAndName(copied.id, startLocal, endLocal, timezone, finalName);

        const text =
          `Copied template ${templateId} → new draft event for '${game_ref}'.\n\n` +
          `- New event id: ${copied.id}\n` +
          `- Name: ${finalName}\n` +
          `- Date: ${date} (${timezone})\n` +
          `- Time: ${String(start_hour).padStart(2, '0')}:00–${String(end_hour).padStart(2, '0')}:00\n` +
          `- Status: draft\n` +
          `- URL: ${copied.url}\n\n` +
          `Review in the Eventbrite UI, then publish_eventbrite_event ${copied.id} when ready.`;
        return { content: [{ type: 'text', text }] };
      } catch (e) {
        return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
      }
    }
  );

  server.tool(
    'publish_eventbrite_event',
    'Publish a draft Eventbrite event so it becomes bookable. Requires a ticket class and venue.',
    { event_id: z.string() },
    async ({ event_id }) => {
      try {
        await publishEvent(event_id);
        return { content: [{ type: 'text', text: `Published ${event_id}.` }] };
      } catch (e) {
        return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
      }
    }
  );

  server.tool(
    'unpublish_eventbrite_event',
    'Unpublish a live Eventbrite event (returns to draft). Stops new bookings; does NOT refund existing attendees.',
    { event_id: z.string() },
    async ({ event_id }) => {
      try {
        await unpublishEvent(event_id);
        return { content: [{ type: 'text', text: `Unpublished ${event_id}.` }] };
      } catch (e) {
        return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
      }
    }
  );

  server.tool(
    'delete_eventbrite_event',
    'Delete an Eventbrite event. Only works for drafts — unpublish first if live.',
    { event_id: z.string() },
    async ({ event_id }) => {
      try {
        await deleteEvent(event_id);
        return { content: [{ type: 'text', text: `Deleted ${event_id}.` }] };
      } catch (e) {
        return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
      }
    }
  );

  server.tool(
    'list_event_attendees',
    'List attendees for an Eventbrite event. Use before unpublishing/deleting an orphan to see who needs a refund.',
    { event_id: z.string() },
    async ({ event_id }) => {
      try {
        const attendees = await listEventAttendees(event_id);
        if (attendees.length === 0) return { content: [{ type: 'text', text: `No attendees for ${event_id}.` }] };
        const lines = attendees.map(a => `- ${a.profile.name || '(no name)'} <${a.profile.email || 'no email'}> — ${a.status}`);
        return { content: [{ type: 'text', text: `${attendees.length} attendee(s):\n\n${lines.join('\n')}` }] };
      } catch (e) {
        return { content: [{ type: 'text', text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true };
      }
    }
  );
}
