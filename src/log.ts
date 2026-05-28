
export function logError(error: Error, message="", debugLevel='ERROR') {
  const now = new Date()
  const time = now.toLocaleTimeString()
  const date = now.toLocaleDateString()

  console.error(`[${date}-${time}]`, debugLevel, message, error.message)
}

export function debug(label: string, data: unknown) {
  console.log(`[DEBUG] ${label}:`, data)
}
