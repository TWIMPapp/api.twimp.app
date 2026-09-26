import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveDateTokens, resolvePlayerVisible } from './dateTokens.ts';

// Noon UTC is the same Europe/London calendar date in both GMT and BST.
function noon(y: number, m: number, d: number): number {
    return Date.UTC(y, m - 1, d, 12, 0, 0);
}

const P = noon(2026, 9, 17); // Thursday 17 Sep 2026

function withWarnings(fn: () => void): string[] {
    const warnings: string[] = [];
    const orig = console.warn;
    console.warn = (...args: unknown[]) => {
        warnings.push(args.map(String).join(' '));
    };
    try {
        fn();
    } finally {
        console.warn = orig;
    }
    return warnings;
}

test('default format and every format code', () => {
    assert.equal(resolveDateTokens('{{P}}', P), 'Thu 17 Sep');
    assert.equal(resolveDateTokens('{{P|dddd}}', P), 'Thursday');
    assert.equal(resolveDateTokens('{{P|ddd}}', P), 'Thu');
    assert.equal(resolveDateTokens('{{P|d}}', P), '17');
    assert.equal(resolveDateTokens('{{P|dd}}', P), '17');
    assert.equal(resolveDateTokens('{{P|Do}}', P), '17th');
    assert.equal(resolveDateTokens('{{P|MMMM}}', P), 'September');
    assert.equal(resolveDateTokens('{{P|MMM}}', P), 'Sep');
    assert.equal(resolveDateTokens('{{P|MM}}', P), '09');
    assert.equal(resolveDateTokens('{{P|yyyy}}', P), '2026');
    assert.equal(resolveDateTokens('{{P|yy}}', P), '26');
    assert.equal(resolveDateTokens('{{P|dddd d MMM yyyy}}', P), 'Thursday 17 Sep 2026');
    // Literals (slash, comma, space) stay.
    assert.equal(resolveDateTokens('{{P|d/MM/yyyy}}', P), '17/09/2026');
});

test('single-digit day is unpadded for d and padded for dd', () => {
    const fifth = noon(2026, 1, 5); // Monday 5 Jan 2026
    assert.equal(resolveDateTokens('{{P|d}}', fifth), '5');
    assert.equal(resolveDateTokens('{{P|dd}}', fifth), '05');
    assert.equal(resolveDateTokens('{{P|Do}}', fifth), '5th');
    assert.equal(resolveDateTokens('{{P|MM}}', fifth), '01');
    assert.equal(resolveDateTokens('{{P|MMM}}', fifth), 'Jan');
    assert.equal(resolveDateTokens('{{P|MMMM}}', fifth), 'January');
    assert.equal(resolveDateTokens('{{P|ddd}}', fifth), 'Mon');
    assert.equal(resolveDateTokens('{{P|dddd}}', fifth), 'Monday');
    assert.equal(resolveDateTokens('{{P|yy}}', fifth), '26');
});

test('ordinals', () => {
    const cases: Array<[number, number, string]> = [
        [1, 1, '1st'],
        [1, 2, '2nd'],
        [1, 3, '3rd'],
        [1, 4, '4th'],
        [1, 11, '11th'],
        [1, 12, '12th'],
        [1, 13, '13th'],
        [1, 21, '21st'],
        [3, 22, '22nd'],
        [3, 23, '23rd'],
        [3, 31, '31st'],
    ];
    for (const [month, day, expected] of cases) {
        assert.equal(resolveDateTokens('{{P|Do}}', noon(2026, month, day)), expected);
    }
});

test('offsets across month and year boundaries, including a leap day', () => {
    const newYear = noon(2026, 1, 1);
    assert.equal(resolveDateTokens('{{P-1|yyyy-MM-dd}}', newYear), '2025-12-31');
    assert.equal(resolveDateTokens('{{P|yyyy-MM-dd}}', newYear), '2026-01-01');
    assert.equal(resolveDateTokens('{{P+1|yyyy-MM-dd}}', newYear), '2026-01-02');

    const newYearsEve = noon(2026, 12, 31);
    assert.equal(resolveDateTokens('{{P+1|yyyy-MM-dd}}', newYearsEve), '2027-01-01');
    assert.equal(resolveDateTokens('{{P-1|d MMM}}', newYearsEve), '30 Dec');

    const march = noon(2026, 3, 1);
    assert.equal(resolveDateTokens('{{P-1|yyyy-MM-dd}}', march), '2026-02-28');

    const leap = noon(2028, 3, 1);
    assert.equal(resolveDateTokens('{{P-1|yyyy-MM-dd}}', leap), '2028-02-29');
    assert.equal(resolveDateTokens('{{P+3|yyyy-MM-dd}}', noon(2026, 1, 30)), '2026-02-02');
});

test('play day is the Europe/London date, including late evening on the DST Sundays', () => {
    // Last Sunday of March 2026, 23:30 BST (clocks went forward at 01:00).
    const marchEvening = Date.parse('2026-03-29T22:30:00.000Z');
    assert.equal(resolveDateTokens('{{P|yyyy-MM-dd}}', marchEvening), '2026-03-29');
    assert.equal(resolveDateTokens('{{P|dddd}}', marchEvening), 'Sunday');
    assert.equal(resolveDateTokens('{{P-1|yyyy-MM-dd}}', marchEvening), '2026-03-28');
    assert.equal(resolveDateTokens('{{P+1|yyyy-MM-dd}}', marchEvening), '2026-03-30');

    // Last Sunday of October 2026, 23:30 GMT (clocks went back at 01:00).
    const octoberEvening = Date.parse('2026-10-25T23:30:00.000Z');
    assert.equal(resolveDateTokens('{{P|yyyy-MM-dd}}', octoberEvening), '2026-10-25');
    assert.equal(resolveDateTokens('{{P|dddd}}', octoberEvening), 'Sunday');
    assert.equal(resolveDateTokens('{{P-1|yyyy-MM-dd}}', octoberEvening), '2026-10-24');
    assert.equal(resolveDateTokens('{{P+1|yyyy-MM-dd}}', octoberEvening), '2026-10-26');

    // Evening before the spring-forward. Adding 24 hours of milliseconds lands
    // on Monday 00:30 BST, i.e. the wrong calendar day. Offset must be +1 day.
    const beforeSpring = Date.parse('2026-03-28T23:30:00.000Z');
    assert.equal(resolveDateTokens('{{P|yyyy-MM-dd}}', beforeSpring), '2026-03-28');
    assert.equal(resolveDateTokens('{{P+1|yyyy-MM-dd}}', beforeSpring), '2026-03-29');

    // 00:30 BST on the fall-back Sunday is still 25 Oct in London, but the
    // previous evening in UTC. P+1 must be the next London date, not +24h.
    const octoberSmallHours = Date.parse('2026-10-24T23:30:00.000Z');
    assert.equal(resolveDateTokens('{{P|yyyy-MM-dd}}', octoberSmallHours), '2026-10-25');
    assert.equal(resolveDateTokens('{{P+1|yyyy-MM-dd}}', octoberSmallHours), '2026-10-26');

    // 00:30 BST in summer is the previous UTC date.
    const juneSmallHours = Date.parse('2026-06-14T23:30:00.000Z');
    assert.equal(resolveDateTokens('{{P|yyyy-MM-dd}}', juneSmallHours), '2026-06-15');
});

test('rel and Rel for every offset from -15 to +15', () => {
    const expected: Record<number, string> = {
        [-15]: 'Wed 2 Sep',
        [-14]: 'Thu 3 Sep',
        [-13]: 'last Friday',
        [-12]: 'last Saturday',
        [-11]: 'last Sunday',
        [-10]: 'last Monday',
        [-9]: 'last Tuesday',
        [-8]: 'last Wednesday',
        [-7]: 'last Thursday',
        [-6]: 'Friday',
        [-5]: 'Saturday',
        [-4]: 'Sunday',
        [-3]: 'Monday',
        [-2]: 'Tuesday',
        [-1]: 'yesterday',
        0: 'today',
        1: 'tomorrow',
        2: 'Saturday',
        3: 'Sunday',
        4: 'Monday',
        5: 'Tuesday',
        6: 'Wednesday',
        7: 'next Thursday',
        8: 'next Friday',
        9: 'next Saturday',
        10: 'next Sunday',
        11: 'next Monday',
        12: 'next Tuesday',
        13: 'next Wednesday',
        14: 'Thu 1 Oct',
        15: 'Fri 2 Oct',
    };

    for (let n = -15; n <= 15; n++) {
        const token = n === 0 ? '{{P|rel}}' : `{{P${n > 0 ? '+' : ''}${n}|rel}}`;
        const relToken = n === 0 ? '{{P|Rel}}' : `{{P${n > 0 ? '+' : ''}${n}|Rel}}`;
        const rel = expected[n];
        const Rel = rel.charAt(0).toUpperCase() + rel.slice(1);
        assert.equal(resolveDateTokens(token, P), rel, token);
        assert.equal(resolveDateTokens(relToken, P), Rel, relToken);
    }
});

test('a sentence can mix rel and an absolute format', () => {
    const text = 'The burglary was {{P-2|rel}} ({{P-2|dddd d MMM}}).';
    assert.equal(resolveDateTokens(text, P), 'The burglary was Tuesday (Tuesday 15 Sep).');
});

test('missing or zero playStart falls back to now', () => {
    const now = noon(2026, 9, 17);
    assert.equal(resolveDateTokens('{{P|yyyy-MM-dd}}', 0, now), '2026-09-17');
    assert.equal(resolveDateTokens('{{P|yyyy-MM-dd}}', undefined, now), '2026-09-17');
    assert.equal(resolveDateTokens('{{P|yyyy-MM-dd}}', null, now), '2026-09-17');
});

test('unknown tokens and bad formats stay visible and warn', () => {
    const warnings = withWarnings(() => {
        const text = 'See {{Q}} and {{P|notAFormat}} and {{P|}} then {{P|dddd}}.';
        assert.equal(
            resolveDateTokens(text, P),
            'See {{Q}} and {{P|notAFormat}} and {{P|}} then Thursday.',
        );
        assert.equal(resolveDateTokens('{{X+1|dddd}}', P), '{{X+1|dddd}}');
        assert.equal(resolveDateTokens('{{P-}}', P), '{{P-}}');
        assert.equal(resolveDateTokens('{{P|REL}}', P), '{{P|REL}}');
        assert.equal(resolveDateTokens('{{P+3|rel extra}}', P), '{{P+3|rel extra}}');
    });
    assert.ok(warnings.length >= 6);
    assert.ok(warnings.every((w) => w.includes('[date-tokens]')));
    assert.ok(warnings.some((w) => w.includes('{{Q}}')));
    assert.ok(warnings.some((w) => w.includes('{{P|notAFormat}}')));
});

test('a string with no token is returned unchanged', () => {
    const text = 'Annie was last seen on Thursday 17 Sep.';
    assert.equal(resolveDateTokens(text, P), text);
});

test('a trail with no tokens is returned unchanged and the source is not copied', () => {
    const task = {
        type: 'information',
        content: 'A 42-row logbook with no tokens.\n\n| Date | Note |\n| --- | --- |\n| 17 Sep | Parcel |',
        image_url: 'https://example.com/{{not-a-player-string}}.png',
        hint: 'Look at the door',
        options: [{ content: 'Sean', response: { title: 'Incorrect', subtitle: 'Try again' } }],
        markers: [{ title: 'Car Park', subtitle: 'Go here', image_url: 'https://example.com/pin.png' }],
    };
    const resolved = resolvePlayerVisible(task, P);
    assert.equal(resolved, task);
    assert.deepEqual(resolved, task);
});

test('tokens are resolved on a copy and image URLs are left alone', () => {
    const task = {
        type: 'information',
        content: 'Reported {{P-1|ddd d MMM}}.',
        image_url: 'https://example.com/{{P}}.png',
        audio_url: 'https://example.com/{{P|yyyy}}.mp3',
        hint: 'Check {{P|rel}}',
        name: 'Logbook {{P-9|ddd d MMM}}',
        options: [
            {
                content: ['{{P|yyyy}}', 'plain'],
                label: '{{P|ddd}}',
                response: { title: 'On {{P|dddd}}', subtitle: '{{P|rel}}', sentiment: 'positive' },
            },
        ],
        markers: [{ title: '{{P+1|dddd}}', subtitle: 'Go here' }],
        on_arrival: ['addItem -item {{P}}'],
    };
    const snapshot = structuredClone(task);
    const resolved = resolvePlayerVisible(task, P);

    assert.notEqual(resolved, task);
    assert.deepEqual(task, snapshot);
    assert.equal(resolved.content, 'Reported Wed 16 Sep.');
    assert.equal(resolved.hint, 'Check today');
    assert.equal(resolved.name, 'Logbook Tue 8 Sep');
    assert.equal(resolved.image_url, task.image_url);
    assert.equal(resolved.audio_url, task.audio_url);
    assert.deepEqual(resolved.options[0].content, ['2026', 'plain']);
    assert.equal(resolved.options[0].label, 'Thu');
    assert.equal(resolved.options[0].response.title, 'On Thursday');
    assert.equal(resolved.options[0].response.subtitle, 'today');
    assert.equal(resolved.options[0].response.sentiment, 'positive');
    assert.equal(resolved.markers[0].title, 'Friday');
    assert.equal(resolved.markers[0].subtitle, 'Go here');
    // Action strings are machine instructions, not player copy.
    assert.deepEqual(resolved.on_arrival, task.on_arrival);
});

test('a dated delivery logbook resolves every row from the same play day', () => {
    const content = [
        'Delivery logbook',
        '',
        '| Date | Drop |',
        '| --- | --- |',
        '| {{P-9|ddd d MMM}} | Side door |',
        '| {{P-2|ddd d MMM}} | Left with a neighbour |',
        '| {{P|ddd d MMM}} | Van returned |',
    ].join('\n');
    const resolved = resolveDateTokens(content, P);
    assert.equal(resolved.includes('{{'), false);
    assert.match(resolved, /Tue 8 Sep \| Side door/);
    assert.match(resolved, /Tue 15 Sep \| Left with a neighbour/);
    assert.match(resolved, /Thu 17 Sep \| Van returned/);
});
