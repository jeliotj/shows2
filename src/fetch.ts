import type { ApiResponse } from './types.js'
import { logger } from './log.js'

export async function getUpcomingShows(number: string): Promise<ApiResponse> {
  logger.info('Getting upcoming shows...')
  const params = new URLSearchParams()
  params.append('count', number)
  try {
    const url = `${process.env.SPINITRON_API}${process.env.SHOWS_ENDPOINT}?${params}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    })
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    const data = (await response.json()) as ApiResponse
    return data
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error(String(error))
  }
}
