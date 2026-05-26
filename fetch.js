export async function getUpcomingShows(number) {
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
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error.message)
  }
}
