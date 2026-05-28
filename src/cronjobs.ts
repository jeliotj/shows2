import fs from 'node:fs/promises'
import path from 'node:path'
import cron from 'node-cron'
import { logError, debug } from './log.js'
import type { Show, Args } from './types.js'

export function createCronTime(show: Show) {
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

export async function createCronJob(show: Show) {
  try {
    const currentShow = show

    const { cronTime, cronString } = createCronTime(currentShow)

    try {
      const task = await createTask(
        currentShow.duration,
        currentShow.title,
        cronTime.month,
        cronTime.dayOfMonth
      )
      if (!task) throw Error("No task created")

      const options = {
        timezone: 'America/Denver',
        //maxExecutions: 1,
      }
      const nextScheduledTask = cron.schedule(cronString, task, options)
      const debugData = {
        task: task,
        cron: (nextScheduledTask as any).cronExpression
      }
      debug('Show Recording Scheduled', debugData)
      
    } catch (error) {
      if (error instanceof Error) logError(error)
    }

  } catch (error) {
    if (error instanceof Error) logError(error)
  }
}

export function createCleanFilename(title: string, month: number, dom: number) {
    if (title === '' || title === undefined) {
      throw Error("Title is empty")
    }
  const cleanName = title
    .trim()
    .replace(/[^a-zA-Z0-9]/g, '')
    .concat(`-${month}-${dom}.js`)
  return cleanName
}

async function createTask(duration: number, title: string, month: number, dom: number) {
  try {
    const fileName = createCleanFilename(title, month, dom)
    if (!process.env.TASKS_DIR) throw new Error('TASKS_DIR is not set')
    const fullPath = path.join(process.env.TASKS_DIR, fileName)
    const durationStr = duration.toString()
    if (!process.env.RECORDINGS_DIR) throw new Error('RECORDINGS_DIR is not set')
    const recordingsDir = path.join(process.env.RECORDINGS_DIR, fileName)

    const args: Args = {
      timeout: durationStr,
      input: `${process.env.STREAM_URL}`,
      output: `${recordingsDir}.${process.env.STREAM_CODEC}`
    }

    const taskFunc = `
  import { spawn } from 'node:child_process'
    console.log('task file loaded')
    export function task() {
      console.log('task() called')
      const ffmpeg = spawn('ffmpeg', ['-t', '${args.timeout}','-i', '${args.input}','-c:a', 'copy','-vn','${args.output}'])

      ffmpeg.stdout.on('data', (data) => console.log('ffmpeg stdout:', data.toString()))
      ffmpeg.stderr.on('data', (data) => console.error('ffmpeg stderr:', data.toString()))
      ffmpeg.on('close', (code) => console.log('ffmpeg exited with code:', code))
      ffmpeg.on('error', (err) => console.error('ffmpeg error:', err.message))
    }
  `
    const tasksDir = await fs.readdir(process.env.TASKS_DIR)
    if (tasksDir.some((element) => element == fileName)) {
      throw Error('File already exists')
    }

    await fs.writeFile(fullPath, taskFunc, 'utf8')
    return fullPath
  } catch (error) {
    if (error instanceof Error) logError(error)
  }
}
