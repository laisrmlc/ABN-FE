import { ref, shallowReadonly } from 'vue'
import { getShows, sortByRating } from '@/utils/showsList'
import { useFetchComposable } from '@/composables/useFetchComposable'
import type { Show } from '@/types/showTypes'

export const useShows = () => {
  const shows = ref<Show[]>([])
  const { loading, error, execute } = useFetchComposable()

  const fetchShows = async () => {
    const result = await execute((signal) => getShows(signal))
    if (result) shows.value = sortByRating(result)
  }

  return {
    shows: shallowReadonly(shows),
    loading,
    error,
    fetchShows,
  }
}
