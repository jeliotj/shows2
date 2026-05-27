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
  console.log(nextShow)
  createCronJob(nextShow)
}

export function findNextShow(showArray) {
  return (
    showArray
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .find((show) => new Date(show.start) > Date.now()) ?? null
  )
}

export function createCronTime(show) {
  const showTime = new Date(show.start)
  const cronTime = {
    // Minute and hour start at 0 in cron; month and day-of-month at 1.
    minute: showTime.getMinutes(),
    hour: showTime.getHours(),
    dayOfMonth: showTime.getDate(),
    month: showTime.getMonth() + 1, // getMonth() is zero-based
  }
  const cronString = 
    `${cronTime.minute} ${cronTime.hour} ${cronTime.dayOfMonth} ${cronTime.month} *`

  return { cronTime, cronString }
}

async function createCronJob(show) {
  try {
    const currentShow = show[0]

    const { cronTime, cronString } = createCronTime(currentShow)

    try {
      const task = await createTask(
        currentShow.duration,
        currentShow.title,
        cronTime.month,
        cronTime.dayOfMonth
      )
    } catch (error) {
      console.error(error.message)
    }
    const options = {
      timezone: 'America/Denver',
      maxExecutions: 1,
    }
    const nextScheduledTask = cron.schedule(cronString, task, options)
  } catch (error) {
    console.error(error.message)
  }
}

export function createCleanFilename(title, month, dom) {
    if (title === '' || title === undefined) {
      throw Error("Title is empty")
    }
  const cleanName = title
    .trim()
    .replace(/[^a-zA-Z0-9]/g, '')
    .concat(`-${month}-${dom}.js`)
  return cleanName
}

async function createTask(duration, title, month, dom) {
  try {
    const fileName = createCleanFilename(title, month, dom)
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
      throw Error('File already exists')
    }

    await fs.writeFile(fullPath, taskFunc, 'utf8')
    return fullPath
  } catch (error) {
    console.error(error.message)
  }
}

main()
