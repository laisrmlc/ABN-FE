import type { Show } from '@/types/showTypes'

export const getShows = async () => {
  const response = await fetch('https://api.tvmaze.com/shows')
  return await response.json()
}

export const sortByRating = (shows: Array<Show>) => {
  return shows.sort((a: Show, b: Show) => (b.rating.average ?? 0) - (a.rating.average ?? 0))
}
