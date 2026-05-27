import { createCleanFilename, createCronTime } from '../app.js'
import { test, expect } from 'vitest'

const show = {
  title: "Grabbin' Lunch",
  start: '2026-05-26T18:00:00+0000',
  duration: 7200,
}

test('creates Showname-Month-DayOfMonth.js filename', () => {
  const month = 5
  const dom = 26
  expect(createCleanFilename(show.title, month, dom)).toBe(
    'GrabbinLunch-5-26.js'
  )
})

test('creates valid crontime string', () => {
  const { cronTime, cronString } = createCronTime(show)
  expect(cronString).toBe('0 12 26 5 *')
})
