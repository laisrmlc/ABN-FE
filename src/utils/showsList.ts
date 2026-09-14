import type { Show } from '@/types/showTypes'
import { REQUEST_TIMEOUT_MS } from '@/utils/constants'

export const getShows = async (): Promise<Show[] | null> => {
  const response = await fetch('https://api.tvmaze.com/shows', {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })

  if (!response.ok) {
    return null
  }

  return await response.json()
}

export const sortByRating = (shows: Array<Show>) => {
  return shows.sort((a: Show, b: Show) => (b.rating.average ?? 0) - (a.rating.average ?? 0))
}

export const getShowInfo = async (id: string) => {
  const response = await fetch(`https://api.tvmaze.com/shows/${id}`, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })

  if (!response.ok) {
    return null
  }

  return await response.json()
}
