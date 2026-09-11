import assert from 'node:assert/strict'
import test from 'node:test'
import { ComboSystem } from '../src/game/systems/ComboSystem.ts'

test('a single cake receives no combo bonus', () => {
  const combo = new ComboSystem()
  combo.beginGesture()
  combo.registerSlice()
  assert.deepEqual(combo.endGesture(), { count: 1, bonusScore: 0, displayMessage: '' })
})

test('three cakes in one gesture receive the correct message and bonus', () => {
  const combo = new ComboSystem()
  combo.beginGesture()
  combo.registerSlice()
  combo.registerSlice()
  combo.registerSlice()
  assert.deepEqual(combo.endGesture(), { count: 3, bonusScore: 30, displayMessage: '糕手！' })
})

test('five or more cakes use the top combo tier', () => {
  const combo = new ComboSystem()
  combo.beginGesture()
  for (let index = 0; index < 6; index += 1) combo.registerSlice()
  assert.deepEqual(combo.endGesture(), { count: 6, bonusScore: 100, displayMessage: '糕！手！降！临！' })
})
