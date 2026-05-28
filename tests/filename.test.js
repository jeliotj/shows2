import { createCleanFilename } from '../dist/app.js'
import { test, expect } from 'vitest'

test('removes special characters from filename', () => {
  const title = "# ? Grabbin' Lunch// _ ^"
  const month = 5
  const dom = 26
  expect(createCleanFilename(title, month, dom)).toBe(
    'GrabbinLunch-5-26.js'
  )
})
