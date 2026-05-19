// Tool definitions for the hosted MCP server at mcp.twimp.app.
//
// Each tool is registered on an McpServer instance via registerTools().
// Both the HTTP handler (api/mcp.ts) and any future stdio wrapper call
// registerTools() against their own server, so tool implementations are
// defined exactly once.

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { geocode, reverseGeocode } from './geocode';
import { getAllVisibleGames, getLiveGames, getGameByRef } from './games';
import {
  createVenue,
  createEvent,
  createTicketClass,
  publishEvent,
  unpublishEvent,
  deleteEvent,
  listOrgEvents,
  listEventAttendees,
  gameRefFromTags,
  TWIMP_TAG_PREFIX,
} from './eventbrite';

const DEFAULT_TZ = 'Europe/London';
const DEFAULT_START_HOUR = 10;
const DEFAULT_END_HOUR = 22;
const DEFAULT_CAPACITY = 20;
const DEFAULT_PRICE_MINOR = 1000; // £10.00
const DEFAULT_CURRENCY = 'GBP';

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

        const created: Array<{ date: string; eventId: string }> = [];
        const skipped: string[] = [];
        const failed: Array<{ date: string; error: string }> = [];

        for (const d of dateRange(startYmd, days)) {
          if (existingDates.has(d)) { skipped.push(d); continue; }
          try {
            const startLocal = `${d}T${String(DEFAULT_START_HOUR).padStart(2, '0')}:00:00`;
            const endLocal = `${d}T${String(DEFAULT_END_HOUR).padStart(2, '0')}:00:00`;
            const ev = await createEvent({
              name: game.name,
              descriptionHtml: game.description || '',
              startLocal,
              endLocal,
              timezone: DEFAULT_TZ,
              currency: DEFAULT_CURRENCY,
              venueId,
              capacity,
              tags: [`${TWIMP_TAG_PREFIX}${game_ref}`],
            });
            await createTicketClass(ev.id, {
              name: 'Standard',
              quantityTotal: capacity,
              costMinorUnits: price_pennies || undefined,
              free: !price_pennies,
              currency: DEFAULT_CURRENCY,
            });
            created.push({ date: d, eventId: ev.id });
          } catch (err: any) {
            failed.push({ date: d, error: err.message });
          }
        }

        let text = `Eventbrite events for '${game_ref}'\n\n`;
        text += `Venue: ${venueId}\n\n`;
        text += `Created (draft): ${created.length}\n`;
        created.forEach(c => { text += `  - ${c.date} → ${c.eventId}\n`; });
        if (skipped.length) text += `\nSkipped (already exists): ${skipped.length}\n  ${skipped.join(', ')}\n`;
        if (failed.length) {
          text += `\nFailed: ${failed.length}\n`;
          failed.forEach(f => { text += `  - ${f.date}: ${f.error}\n`; });
        }
        if (created.length) text += `\nReview in the Eventbrite UI, then publish_eventbrite_event for each.\n`;
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
