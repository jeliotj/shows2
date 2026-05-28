import { createCronTime } from '../dist/app.js'
import { test, expect } from 'vitest'

test('creates valid crontime string', () => {
  const show = {
    start: "2026-02-02T12:00:00"
  }
  const { cronTime, cronString } = createCronTime(show)
  expect(cronString).toBe('0 12 2 2 *')
})
