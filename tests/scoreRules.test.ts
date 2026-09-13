import assert from 'node:assert/strict'
import test from 'node:test'
import { addScore, applyPlatePenalty } from '../src/game/systems/scoreRules.ts'

test('cake scores add to the current score', () => {
  assert.equal(addScore(40, 10), 50)
})

test('plate hits subtract points without allowing negative scores', () => {
  assert.equal(applyPlatePenalty(120, 50), 70)
  assert.equal(applyPlatePenalty(30, 50), 0)
})
