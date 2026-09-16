import { onUnmounted, ref, shallowReadonly } from 'vue'
import { getShows, sortByRating } from '@/utils/showsList'
import type { Show } from '@/types/showTypes'

export const useShows = () => {
  const shows = ref<Show[]>([])
  const loading = ref(false)
  const error = ref(false)

  const controller = new AbortController()
  onUnmounted(() => controller.abort())

  const fetchShows = async () => {
    try {
      loading.value = true
      error.value = false
      const result = await getShows(controller.signal)
      shows.value = sortByRating(result)
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      error.value = true
    } finally {
      loading.value = false
    }
  }

  return {
    shows: shallowReadonly(shows),
    loading: shallowReadonly(loading),
    error: shallowReadonly(error),
    fetchShows,
  }
}
