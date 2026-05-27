import { expect, test } from 'vitest'
import { findNextShow } from '../app.js'

test('returns next show when array includes past, next, and future', () => {
  const shows = [
    { id: 1, start: "2020-01-01T00:00:00Z" }, // past
    { id: 2, start: "2099-01-01T00:00:00Z" }, // next
    { id: 3, start: "2099-06-01T00:00:00Z" }, // future but not next
  ];

  expect(findNextShow(shows)).toStrictEqual({ id: 2, start: "2099-01-01T00:00:00Z" })
})

test('returns null when all shows are past', () => {
  const shows = [{ start: "2020-01-01T00:00:00Z" }]
  expect(findNextShow(shows)).toBeNull()
})

test('returns soonest show when all shows are in future', () => {
  const shows = [
    { id: 2, start: "2099-01-01T00:00:00Z" }, // next
    { id: 3, start: "2099-06-01T00:00:00Z" }, // future but not next
  ]
  expect(findNextShow(shows)).toStrictEqual({ id: 2, start: "2099-01-01T00:00:00Z" })
})

test('returns cleanly when array is empty', () => {
  expect(() => findNextShow([])).not.toThrow()
  expect(findNextShow([])).toBeNull()
})

test('returns null when next show is exactly now', () => {
  const shows = [{ start: Date.now()}]
  expect(findNextShow(shows)).toBeNull()
})
