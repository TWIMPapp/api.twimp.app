// Play-day date tokens for story-trail copy.
//
// Authors write {{P}}, {{P-1}}, {{P+3|dddd d MMM}} and so on. Each token is
// resolved when a response is built, relative to the Europe/London calendar
// date of the session's playStart. The cached trail is never mutated — callers
// pass a value and receive a copy only when a token actually changes.

const LONDON = 'Europe/London';

const londonYmdFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: LONDON,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
});

const weekdayLongFormatter = new Intl.DateTimeFormat('en-GB', { weekday: 'long', timeZone: 'UTC' });
const weekdayShortFormatter = new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'UTC' });
const monthLongFormatter = new Intl.DateTimeFormat('en-GB', { month: 'long', timeZone: 'UTC' });

const DEFAULT_FORMAT = 'ddd d MMM';

// Longest match first so `dddd` is not read as four `d` codes and `Do` is not `d` + "o".
const FORMAT_CODES = ['dddd', 'ddd', 'dd', 'Do', 'd', 'MMMM', 'MMM', 'MM', 'yyyy', 'yy'] as const;

const TOKEN_RE = /\{\{([^{}\n]+)\}\}/g;

// Strings a player can read. URL fields and machine ids (key, state, actions)
// are intentionally absent.
const PLAYER_TEXT_KEYS = new Set([
    'content',
    'hint',
    'title',
    'subtitle',
    'caption',
    'name',
    'label',
]);

interface CalendarDate {
    y: number;
    m: number;
    d: number;
}

function anchorMs(playStart: number | null | undefined, now: number): number {
    if (typeof playStart === 'number' && Number.isFinite(playStart) && playStart !== 0) {
        return playStart;
    }
    return now;
}

function londonCalendarDate(ms: number): CalendarDate {
    const parts = londonYmdFormatter.formatToParts(new Date(ms));
    const num = (type: Intl.DateTimeFormatPartTypes) =>
        Number(parts.find((p) => p.type === type)?.value);
    const y = num('year');
    const m = num('month');
    const d = num('day');
    if (!y || !m || !d) {
        throw new Error('Could not read Europe/London calendar date');
    }
    return { y, m, d };
}

// Whole calendar days, not 24-hour steps, so a play day stays put across the
// BST/GMT change (a London day is 23 or 25 hours on the transition Sundays).
function addCalendarDays(date: CalendarDate, offset: number): CalendarDate {
    const shifted = new Date(Date.UTC(date.y, date.m - 1, date.d + offset));
    return {
        y: shifted.getUTCFullYear(),
        m: shifted.getUTCMonth() + 1,
        d: shifted.getUTCDate(),
    };
}

function utcNoon(date: CalendarDate): Date {
    return new Date(Date.UTC(date.y, date.m - 1, date.d, 12));
}

function weekdayLong(date: CalendarDate): string {
    return weekdayLongFormatter.format(utcNoon(date));
}

function weekdayShort(date: CalendarDate): string {
    return weekdayShortFormatter.format(utcNoon(date));
}

function monthLong(date: CalendarDate): string {
    return monthLongFormatter.format(utcNoon(date));
}

// en-GB Intl currently abbreviates September as "Sept". Authors were promised "Sep".
function monthShort(date: CalendarDate): string {
    const long = monthLong(date);
    if (long === 'September') return 'Sep';
    return long.slice(0, 3);
}

function ordinal(day: number): string {
    const mod100 = day % 100;
    if (mod100 >= 11 && mod100 <= 13) return `${day}th`;
    switch (day % 10) {
        case 1: return `${day}st`;
        case 2: return `${day}nd`;
        case 3: return `${day}rd`;
        default: return `${day}th`;
    }
}

function renderCode(code: (typeof FORMAT_CODES)[number], date: CalendarDate): string {
    switch (code) {
        case 'dddd': return weekdayLong(date);
        case 'ddd': return weekdayShort(date);
        case 'dd': return String(date.d).padStart(2, '0');
        case 'Do': return ordinal(date.d);
        case 'd': return String(date.d);
        case 'MMMM': return monthLong(date);
        case 'MMM': return monthShort(date);
        case 'MM': return String(date.m).padStart(2, '0');
        case 'yyyy': return String(date.y);
        case 'yy': return String(date.y).slice(-2).padStart(2, '0');
    }
}

// null = the format contains a letter that is not a known code.
function applyFormat(date: CalendarDate, format: string): string | null {
    let i = 0;
    let out = '';
    while (i < format.length) {
        let matched: (typeof FORMAT_CODES)[number] | null = null;
        for (const code of FORMAT_CODES) {
            if (format.startsWith(code, i)) {
                matched = code;
                break;
            }
        }
        if (matched) {
            out += renderCode(matched, date);
            i += matched.length;
            continue;
        }
        const ch = format[i];
        if (/[A-Za-z]/.test(ch)) return null;
        out += ch;
        i++;
    }
    return out;
}

function capitalise(text: string): string {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function relativeLabel(offset: number, date: CalendarDate, capitaliseFirst: boolean): string {
    const day = weekdayLong(date);
    let text: string;
    if (offset === 0) text = 'today';
    else if (offset === -1) text = 'yesterday';
    else if (offset === 1) text = 'tomorrow';
    else if ((offset <= -2 && offset >= -6) || (offset >= 2 && offset <= 6)) text = day;
    else if (offset <= -7 && offset >= -13) text = `last ${day}`;
    else if (offset >= 7 && offset <= 13) text = `next ${day}`;
    else text = applyFormat(date, DEFAULT_FORMAT) ?? '';

    return capitaliseFirst ? capitalise(text) : text;
}

// null means "leave the raw token alone".
function resolveInner(inner: string, playStart: number | null | undefined, now: number): string | null {
    const match = inner.match(/^P(?:([+-])(\d+))?(?:\|([\s\S]*))?$/);
    if (!match) return null;

    let offset = 0;
    if (match[1]) {
        offset = parseInt(match[2], 10);
        if (!Number.isFinite(offset)) return null;
        if (match[1] === '-') offset = -offset;
    }

    const format = match[3];
    if (format === '') return null;

    const anchor = londonCalendarDate(anchorMs(playStart, now));
    const date = addCalendarDays(anchor, offset);

    if (format === undefined) {
        return applyFormat(date, DEFAULT_FORMAT);
    }
    if (format === 'rel' || format === 'Rel') {
        return relativeLabel(offset, date, format === 'Rel');
    }
    return applyFormat(date, format);
}

/**
 * Replace date tokens in one string. A string with no `{{` is returned as-is.
 * Unknown anchors and bad formats are left untouched and logged; this never throws.
 *
 * `now` is the clock used when playStart is missing or 0. Tests pass it explicitly.
 */
export function resolveDateTokens(
    text: string,
    playStart: number | null | undefined,
    now: number = Date.now(),
): string {
    if (!text.includes('{{')) return text;
    return text.replace(TOKEN_RE, (raw, inner: string) => {
        try {
            const resolved = resolveInner(inner, playStart, now);
            if (resolved === null) {
                console.warn(`[date-tokens] leaving unresolved token ${raw}`);
                return raw;
            }
            return resolved;
        } catch (err) {
            console.warn(`[date-tokens] leaving unresolved token ${raw}`, err);
            return raw;
        }
    });
}

// `asText` is true only for a player-visible field (or a top-level string).
// Strings elsewhere — image URLs, item keys, action commands — are left as-is.
// Objects are always walked field by field, so a non-text array of options
// still resolves each option's content.
function walk(
    value: unknown,
    asText: boolean,
    playStart: number | null | undefined,
    now: number,
): unknown {
    if (typeof value === 'string') {
        if (!asText || !value.includes('{{')) return value;
        return resolveDateTokens(value, playStart, now);
    }
    if (Array.isArray(value)) {
        let changed = false;
        const next = value.map((item) => {
            const childAsText = typeof item === 'string' ? asText : false;
            const resolved = walk(item, childAsText, playStart, now);
            if (resolved !== item) changed = true;
            return resolved;
        });
        return changed ? next : value;
    }
    if (value && typeof value === 'object') {
        let changed = false;
        const src = value as Record<string, unknown>;
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(src)) {
            const resolved = walk(v, PLAYER_TEXT_KEYS.has(k), playStart, now);
            if (resolved !== v) changed = true;
            out[k] = resolved;
        }
        return changed ? out : value;
    }
    return value;
}

/**
 * Resolve date tokens in player-visible strings on a response payload.
 * Returns the same reference when nothing contains a token.
 */
export function resolvePlayerVisible<T>(
    value: T,
    playStart: number | null | undefined,
    now: number = Date.now(),
): T {
    return walk(value, typeof value === 'string', playStart, now) as T;
}
