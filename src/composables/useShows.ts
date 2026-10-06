import { onUnmounted, ref, shallowReadonly } from 'vue'
import { getShows, sortByRating } from '@/utils/showsList'
import type { Show } from '@/types/showTypes'
import { useFetchComposable } from './useFetchComposable'

export const useShows = () => {
  const showsList = ref<Show[]>([])
  const { loading, error, execute } = useFetchComposable()

  const fetchShows = async () => {
    const response = await execute((signal: AbortSignal) => getShows(signal))
    showsList.value = sortByRating(response || [])
  }

  return {
    shows: shallowReadonly(showsList),
    loading: shallowReadonly(loading),
    error: shallowReadonly(error),
    fetchShows,
  }
}
