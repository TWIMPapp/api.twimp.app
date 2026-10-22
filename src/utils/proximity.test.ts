import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isInvertedStep, isTriggered, pickActivatedStep } from './proximity.ts';

test('isInvertedStep reads on_search.inverted', () => {
    assert.equal(isInvertedStep({ on_search: { inverted: true } }), true);
    assert.equal(isInvertedStep({ on_search: { proximity_radius: 5 } }), false);
    assert.equal(isInvertedStep({}), false);
});

test('normal fires inside, inverted fires outside (buffer widens circle)', () => {
    assert.equal(isTriggered(5, 11, false), true);
    assert.equal(isTriggered(20, 11, false), false);
    // arena radius 1000 + 40 buffer: 1020 m away is still inside → quiet
    assert.equal(isTriggered(1020, 1040, true), false);
    assert.equal(isTriggered(1041, 1040, true), true);
});

test('normal step beats inverted', () => {
    const steps = [
        { index: 3, allowed: true, inRange: true, inverted: false },
        { index: 9, allowed: true, inRange: true, inverted: true },
    ];
    assert.equal(pickActivatedStep(steps)?.index, 3);
    const inv = [{ index: 9, allowed: true, inRange: true, inverted: true }, ...steps];
    assert.equal(pickActivatedStep(inv)?.index, 3);
});

test('inverted fires only when it is the only match', () => {
    const steps = [
        { index: 3, allowed: true, inRange: false, inverted: false },
        { index: 9, allowed: true, inRange: true, inverted: true },
    ];
    assert.equal(pickActivatedStep(steps)?.index, 9);
});

test('gate: inverted not allowed (e.g. step 0 not done) never fires', () => {
    const steps = [{ index: 9, allowed: false, inRange: true, inverted: true }];
    assert.equal(pickActivatedStep(steps), undefined);
});
