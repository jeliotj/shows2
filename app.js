import 'dotenv/config'
import { getUpcomingShows } from './fetch.js'
import fs from 'node:fs/promises'
import cron from 'node-cron'

const NUMBER_OF_SHOWS = 2

async function main() {
  const upcoming = await getUpcomingShows(NUMBER_OF_SHOWS)
  const shows = upcoming.items.map(({ title, start, duration }) => ({
    title,
    start,
    duration,
  }))

  const nextShow = findNextShow(shows)
  createCronJob(nextShow)
}

function findNextShow(showArray) {
  const nextShow = showArray.filter((show) => {
    const start = new Date(show.start)
    return start > Date.now()
  })
  return nextShow
}

async function createCronJob(show) {
  try {
    const currentShow = show[0]
    const showTime = new Date(currentShow.start)
    const cronTime = {
      // Minute and hour start at 0 in cron; month and day-of-month at 1.
      minute: showTime.getMinutes(),
      hour: showTime.getHours(),
      dayOfMonth: showTime.getDate(),
      month: showTime.getMonth() + 1, // getMonth() is zero-based
    }
    try {
    const task = await createTask(
      currentShow.duration,
      currentShow.title,
      cronTime.month,
      cronTime.dayOfMonth
    )
    } catch (error) {

    }
    const options = {
      timezone: 'America/Denver',
      maxExecutions: 1,
    }
    const nextScheduledTask = cron.schedule(
      `${cronTime.minute} ${cronTime.hour} ${cronTime.dayOfMonth} ${cronTime.month} *`,
      task,
      options
    )
  } catch (error) {
    console.error(error.message)
  }
}

async function createTask(duration, title, month, dom) {
  try {
    // Build a cleaned up filename like "ShowName-Month-DayOfMonth"
    const fileName = title
      .trim()
      .replace(/[^a-zA-Z0-9]/g, '')
      .concat(`-${month}-${dom}.js`)
    const fullPath = `./tasks/${fileName}`

    const args = `[
      '-t', duration,
      '-i', '${process.env.STREAM_URL}',
      '-c:a', 'copy',
      '-vn',
      '${fileName}.mp3'
    ]`

    const taskFunc = `
  import { spawn } from 'node:child_process'
    export function task() {
      spawn('ffmpeg', ${args})
    }
  `
    const tasksDir = await fs.readdir('./tasks/')
    if (tasksDir.some((element) => element == fileName)) {
      throw Error("File already exists")
    }

    await fs.writeFile(fullPath, taskFunc, 'utf8')
    return fullPath
  } catch (error) {
    console.error(error.message)
  }
}

main()
