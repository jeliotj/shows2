export type Show = {
  title: string
  start: string
  duration: number
}

export type ApiResponse = {
  items: Show[]
}

export type Args = {
  timeout: string,
  input: string,
  output: string
}


