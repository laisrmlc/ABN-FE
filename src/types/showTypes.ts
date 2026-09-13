export interface Show {
  id: number
  name: string
  genres: string[]
  status: string
  summary: string

  image: {
    medium: string
    original: string
  } | null

  rating: {
    average: number | null
  }

  schedule: {
    time: string
    days: string[]
  }

  network: {
    name: string
  } | null

  webChannel: {
    name: string
  } | null
}
