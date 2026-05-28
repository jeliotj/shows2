import 'dotenv/config'
import { getUpcomingShows } from './fetch.js'
import { createCronJob } from './cronjobs.js'
import { logger } from './log.js'
import { saveShows, getNextShowFromDb } from './queries.js'
import type { Show } from './types.js'

const NUMBER_OF_SHOWS = '3'

export function findNextShow(showArray: Show[]): Show | null {
  return (
    showArray
      .sort((a, b) => +new Date(a.start) - +new Date(b.start))
      .find((show) => +new Date(show.start) > Date.now()) ?? null
  )
}

async function main() {
  logger.info('Starting the app...')

  const upcoming = await getUpcomingShows(NUMBER_OF_SHOWS)
  saveShows(upcoming.items)

  const nextShow = getNextShowFromDb()
  console.log(nextShow);

  if (!nextShow) {
    logger.error('Next show not found')
    return
  }

  // createCronJob(nextShow)
}

main()
