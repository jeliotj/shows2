
  import { spawn } from 'node:child_process'
    export function task() {
      spawn('ffmpeg', [
      '-i', 'http://local.kbmf.fm:9999/stream',
      '-c:a', 'copy',
      '-vn',
      'HamersScintillatingTunes-5-26.mp3'
    ])
    }
  