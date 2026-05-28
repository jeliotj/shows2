import { createCronJob } from './cronjobs.js'

const soon = new Date(Date.now() + 120 * 1000)

const mockShow = {
  title: 'Test Show',
  start: soon.toISOString(),
  duration: 60,
}

console.log('Scheduling test show for', soon.toLocaleTimeString())
createCronJob(mockShow)
process.stdin.resume()
