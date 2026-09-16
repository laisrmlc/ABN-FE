import type { Show } from '@/types/showTypes'
import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '@/utils/constants'

export const getShows = async (signal: AbortSignal): Promise<Show[]> => {
  const response = await fetch(`${API_BASE_URL}/shows`, {
    signal: AbortSignal.any([AbortSignal.timeout(REQUEST_TIMEOUT_MS), signal]),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch shows: ${response.status}`)
  }

  return await response.json()
}

export const sortByRating = (shows: Array<Show>): Array<Show> => {
  return [...shows].sort((a: Show, b: Show) => (b.rating.average ?? 0) - (a.rating.average ?? 0))
}

export const getShowInfo = async (id: string, signal: AbortSignal): Promise<Show | null> => {
  const response = await fetch(`${API_BASE_URL}/shows/${id}`, {
    signal: AbortSignal.any([AbortSignal.timeout(REQUEST_TIMEOUT_MS), signal]),
  })

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch show ${id}: ${response.status}`)
  }

  return await response.json()
}
