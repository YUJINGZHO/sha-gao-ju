import assert from 'node:assert/strict'
import test from 'node:test'
import { segmentIntersectsCircle } from '../src/game/math/segmentCircle.ts'

test('detects a fast segment passing fully through a cake', () => {
  assert.equal(segmentIntersectsCircle(
    { x: 10, y: 100 },
    { x: 230, y: 100 },
    { x: 120, y: 100, radius: 28 },
  ), true)
})

test('detects an endpoint touching the hit circle', () => {
  assert.equal(segmentIntersectsCircle(
    { x: 0, y: 0 },
    { x: 50, y: 0 },
    { x: 70, y: 0, radius: 20 },
  ), true)
})

test('rejects a nearby segment outside the hit radius', () => {
  assert.equal(segmentIntersectsCircle(
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 50, y: 35, radius: 25 },
  ), false)
})

test('allows a small speed-based forgiveness padding', () => {
  assert.equal(segmentIntersectsCircle(
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 50, y: 31, radius: 25 },
    7,
  ), true)
})
