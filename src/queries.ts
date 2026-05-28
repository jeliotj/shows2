import db from './db.js'
import { logger } from './log.js'
import type { Statement } from 'better-sqlite3'
import type { Show } from './types.js'

db.prepare(`CREATE TABLE 
  IF NOT EXISTS
  shows(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  start TEXT,
  duration INTEGER)`).run()

export const insertShow: Statement = db.prepare(`INSERT INTO 
  shows(
  title,
  start,
  duration) 
  VALUES (?, ?, ?)`)

export const getNextShow: Statement = db.prepare(`SELECT *
  FROM shows
  WHERE start > datetime('now')
  ORDER BY start ASC
  LIMIT 1`)

export function saveShows(upcomingShows: Show[]) {
  const shows: Show[] = upcomingShows.map(({ title, start, duration }) => ({
    title,
    start,
    duration,
  }))
  try {
    for (const show of shows) {
      const info = insertShow.run(show.title, show.start, show.duration)
      logger.info(info)
    }
  } catch (error) {
    logger.error({ error }, 'Saving shows failed')
  }
}

export function getNextShowFromDb() {
  try {
    const show = getNextShow.run()
    // logger.info(`${show.title} retrieved as next show`)
    console.log(show)
    return show
  } catch (error) {
    logger.error({ error }, 'Getting next show failed')
  }
}

