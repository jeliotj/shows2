import 'dotenv/config'
import { getUpcomingShows } from './fetch.js'
import { createCronJob } from './cronjobs.js'
import { logError, debug } from './log.js'
import type { Show } from './types.js'


const NUMBER_OF_SHOWS = '3'

async function main() {
  const upcoming = await getUpcomingShows(NUMBER_OF_SHOWS)
  const shows: Show[] = upcoming.items?.map(({ title, start, duration }) => ({
    title,
    start,
    duration,
  }))

  const nextShow = findNextShow(shows)
  if (!nextShow) return
  createCronJob(nextShow)
}

export function findNextShow(showArray: Show[]): Show | null {
  return (
    showArray
      .sort((a, b) => +new Date(a.start) - +new Date(b.start))
      .find((show) => +new Date(show.start) > Date.now()) ?? null
  )
}



main()
