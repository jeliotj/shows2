import 'dotenv/config'
import { getUpcomingShows } from './fetch.js'
import { createCronJob } from './cronjobs.js'
import { logger } from './log.js'
import type { Show } from './types.js'

export function findNextShow(showArray: Show[]): Show | null {
  return (
    showArray
      .sort((a, b) => +new Date(a.start) - +new Date(b.start))
      .find((show) => +new Date(show.start) > Date.now()) ?? null
  )
}

async function main() {
  logger.info('Starting the app...')

  const upcoming = await getUpcomingShows('3')

  const shows: Show[] = upcoming.items?.map(({ title, start, duration }) => ({
    title,
    start,
    duration,
  }))

  const nextShow = findNextShow(shows)

  if (!nextShow) {
    logger.error('Next show not found')
    return
  }
  createCronJob(nextShow)
}

main()
