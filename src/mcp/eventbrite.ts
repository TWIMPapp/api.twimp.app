// Thin Eventbrite v3 API client — fetch only, no SDK.
//
// Auth: personal OAuth token in EVENTBRITE_TOKEN env var.
// Org:  EVENTBRITE_ORG_ID env var (TWIMP org).
//
// Convention: every event we create gets a tag `twimp_game:<ref>` so we
// can map back to a TWIMP game without relying on the event name.

const API_BASE = 'https://www.eventbriteapi.com/v3';

const TOKEN = process.env.EVENTBRITE_TOKEN;
const ORG_ID = process.env.EVENTBRITE_ORG_ID;

export const TWIMP_TAG_PREFIX = 'twimp_game:';

function authHeaders(hasBody: boolean): Record<string, string> {
  if (!TOKEN) throw new Error('EVENTBRITE_TOKEN not set');
  const h: Record<string, string> = { 'Authorization': `Bearer ${TOKEN}` };
  // Eventbrite quirk: sending Content-Type on a GET makes it ignore query-string filters.
  // Only send it when there's a body.
  if (hasBody) h['Content-Type'] = 'application/json';
  return h;
}

function orgId(): string {
  if (!ORG_ID) throw new Error('EVENTBRITE_ORG_ID not set');
  return ORG_ID;
}

async function eb<T = any>(path: string, init?: RequestInit): Promise<T> {
  const hasBody = !!(init && init.body);
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { ...authHeaders(hasBody), ...(init?.headers || {}) },
  });
  const text = await res.text();
  let body: any;
  try { body = text ? JSON.parse(text) : {}; } catch { body = { raw: text }; }
  if (!res.ok) {
    const msg = body?.error_description || body?.error || res.statusText;
    throw new Error(`Eventbrite ${res.status} ${path}: ${msg}`);
  }
  return body as T;
}

// ---------- Types ----------

export interface EventbriteVenue {
  id: string;
  name: string;
  address?: {
    address_1?: string;
    city?: string;
    region?: string;
    postal_code?: string;
    country?: string;
    latitude?: string;
    longitude?: string;
    localized_address_display?: string;
  };
}

export interface EventbriteEvent {
  id: string;
  name: { text: string; html: string };
  description?: { text?: string; html?: string };
  start: { timezone: string; local: string; utc: string };
  end: { timezone: string; local: string; utc: string };
  status: 'draft' | 'live' | 'started' | 'ended' | 'completed' | 'canceled';
  url: string;
  currency: string;
  venue_id?: string | null;
  capacity?: number | null;
  online_event?: boolean;
}

// Tags on Eventbrite events are returned via the `tags` expansion.
export interface EventbriteEventWithTags extends EventbriteEvent {
  tags?: Array<{ id: string; tag: string }>;
}

// ---------- Venues ----------

export async function createVenue(opts: {
  name: string;
  lat: number;
  lng: number;
  addressLine?: string;
  city?: string;
  postcode?: string;
  country?: string; // ISO-2
}): Promise<EventbriteVenue> {
  const body = {
    venue: {
      name: opts.name,
      address: {
        address_1: opts.addressLine || opts.name,
        city: opts.city,
        postal_code: opts.postcode,
        country: opts.country || 'GB',
        latitude: String(opts.lat),
        longitude: String(opts.lng),
      },
    },
  };
  const r = await eb<EventbriteVenue>(`/organizations/${orgId()}/venues/`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return r;
}

// ---------- Events ----------

export async function createEvent(opts: {
  name: string;
  descriptionHtml?: string;
  startLocal: string; // ISO-ish "2026-05-19T10:00:00"
  endLocal: string;
  timezone?: string; // default Europe/London
  currency?: string; // default GBP
  venueId?: string;
  capacity?: number;
  tags?: string[];
}): Promise<EventbriteEvent> {
  const tz = opts.timezone || 'Europe/London';
  const body: any = {
    event: {
      name: { html: opts.name },
      description: opts.descriptionHtml ? { html: opts.descriptionHtml } : undefined,
      start: { timezone: tz, utc: toUtc(opts.startLocal, tz) },
      end: { timezone: tz, utc: toUtc(opts.endLocal, tz) },
      currency: opts.currency || 'GBP',
      online_event: false,
      venue_id: opts.venueId,
      capacity: opts.capacity,
      listed: true,
      shareable: true,
    },
  };
  const created = await eb<EventbriteEvent>(`/organizations/${orgId()}/events/`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  // Tags are set via a separate endpoint
  if (opts.tags && opts.tags.length) {
    await setEventTags(created.id, opts.tags);
  }
  return created;
}

export async function setEventTags(eventId: string, tags: string[]): Promise<void> {
  await eb(`/events/${eventId}/`, {
    method: 'POST',
    body: JSON.stringify({ event: { tags } }),
  });
}

export async function getEvent(eventId: string): Promise<EventbriteEventWithTags> {
  return eb<EventbriteEventWithTags>(`/events/${eventId}/?expand=tags`);
}

export async function listOrgEvents(opts?: {
  status?: 'draft' | 'live' | 'started' | 'ended' | 'all';
  startRangeStart?: string; // accepts ISO datetime or YYYY-MM-DD; truncated to date
  startRangeEnd?: string;
}): Promise<EventbriteEventWithTags[]> {
  const params = new URLSearchParams();
  params.set('expand', 'tags');
  if (opts?.status) params.set('status', opts.status);
  // Eventbrite expects YYYY-MM-DD for these filters
  const toDateOnly = (s: string) => s.slice(0, 10);
  if (opts?.startRangeStart) params.set('start_date.range_start', toDateOnly(opts.startRangeStart));
  if (opts?.startRangeEnd) params.set('start_date.range_end', toDateOnly(opts.startRangeEnd));

  const events: EventbriteEventWithTags[] = [];
  let continuation: string | undefined;
  do {
    if (continuation) params.set('continuation', continuation);
    const r: any = await eb(`/organizations/${orgId()}/events/?${params.toString()}`);
    events.push(...(r.events || []));
    continuation = r.pagination?.has_more_items ? r.pagination?.continuation : undefined;
  } while (continuation);
  return events;
}

export async function publishEvent(eventId: string): Promise<any> {
  return eb(`/events/${eventId}/publish/`, { method: 'POST' });
}

export async function unpublishEvent(eventId: string): Promise<any> {
  return eb(`/events/${eventId}/unpublish/`, { method: 'POST' });
}

export async function deleteEvent(eventId: string): Promise<any> {
  return eb(`/events/${eventId}/`, { method: 'DELETE' });
}

// ---------- Ticket classes ----------

export async function createTicketClass(eventId: string, opts: {
  name: string;
  quantityTotal: number;
  costMinorUnits?: number; // e.g. 1000 = £10.00 (omit for free)
  currency?: string; // default GBP
  free?: boolean;
}): Promise<any> {
  const free = opts.free === true || opts.costMinorUnits == null;
  const ticket: any = {
    name: opts.name,
    quantity_total: opts.quantityTotal,
    free,
  };
  if (!free) {
    const cur = opts.currency || 'GBP';
    ticket.cost = `${cur},${opts.costMinorUnits}`;
  }
  return eb(`/events/${eventId}/ticket_classes/`, {
    method: 'POST',
    body: JSON.stringify({ ticket_class: ticket }),
  });
}

// ---------- Attendees ----------

export async function listEventAttendees(eventId: string): Promise<Array<{
  id: string;
  status: string;
  profile: { name?: string; email?: string };
}>> {
  const attendees: any[] = [];
  let continuation: string | undefined;
  do {
    const params = new URLSearchParams();
    if (continuation) params.set('continuation', continuation);
    const r: any = await eb(`/events/${eventId}/attendees/?${params.toString()}`);
    attendees.push(...(r.attendees || []));
    continuation = r.pagination?.has_more_items ? r.pagination?.continuation : undefined;
  } while (continuation);
  return attendees;
}

// ---------- Helpers ----------

// Convert a local ISO timestamp ("2026-05-19T10:00:00") in a given IANA
// timezone to a UTC ISO string. Avoids pulling in a date library.
function toUtc(localIso: string, timezone: string): string {
  // Strip trailing Z if present
  const clean = localIso.replace(/Z$/, '').replace(/\+\d\d:?\d\d$/, '');
  const [datePart, timePart = '00:00:00'] = clean.split('T');
  const [y, m, d] = datePart.split('-').map(Number);
  const [hh, mm, ss = 0] = timePart.split(':').map(Number);

  // Trick: build a Date as if it were UTC, then ask what that wall-clock
  // moment looks like in the target tz, and shift by the diff.
  const asUtc = Date.UTC(y, m - 1, d, hh, mm, Number(ss) || 0);
  const tzOffsetMin = getTimezoneOffsetMinutes(new Date(asUtc), timezone);
  // The wall-clock time in `timezone` should equal what the user typed.
  // The Date corresponding to that wall-clock in UTC is asUtc - offset.
  const realUtc = asUtc - tzOffsetMin * 60_000;
  return new Date(realUtc).toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function getTimezoneOffsetMinutes(date: Date, timezone: string): number {
  // Use Intl to render the same instant in target tz, then diff.
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const parts = dtf.formatToParts(date).reduce<Record<string, string>>((acc, p) => {
    if (p.type !== 'literal') acc[p.type] = p.value;
    return acc;
  }, {});
  const asTzUtc = Date.UTC(
    Number(parts.year), Number(parts.month) - 1, Number(parts.day),
    Number(parts.hour === '24' ? '0' : parts.hour), Number(parts.minute), Number(parts.second),
  );
  return (asTzUtc - date.getTime()) / 60_000;
}

export function gameRefFromTags(tags?: Array<{ tag: string }>): string | null {
  if (!tags) return null;
  for (const t of tags) {
    if (t.tag && t.tag.startsWith(TWIMP_TAG_PREFIX)) {
      return t.tag.slice(TWIMP_TAG_PREFIX.length);
    }
  }
  return null;
}
) return null;
  for (const t of tags) {
    if (t.tag && t.tag.startsWith(TWIMP_TAG_PREFIX)) {
      return t.tag.slice(TWIMP_TAG_PREFIX.length);
    }
  }
  return null;
}
romTags(tags?: Array<{ tag: string }>): string | null {
  if (!tags) return null;
  for (const t of tags) {
    if (t.tag && t.tag.startsWith(TWIMP_TAG_PREFIX)) {
      return t.tag.slice(TWIMP_TAG_PREFIX.length);
    }
  }
  return null;
}
