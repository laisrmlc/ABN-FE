import { onUnmounted, ref, shallowReadonly } from 'vue'
import { getShowInfo } from '@/utils/showsList'
import type { Show } from '@/types/showTypes'

export const useShowDetails = () => {
  const selectedShow = ref<Show | null>(null)
  const loading = ref(false)
  const error = ref(false)

  const controller = new AbortController()
  onUnmounted(() => controller.abort())

  const fetchShow = async (id: string) => {
    try {
      loading.value = true
      error.value = false
      selectedShow.value = await getShowInfo(id, controller.signal)
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        console.warn('Request aborted:', err)
        return
      }
      console.error(err)
      error.value = true
    } finally {
      loading.value = false
    }
  }

  return {
    selectedShow: shallowReadonly(selectedShow),
    loading: shallowReadonly(loading),
    error: shallowReadonly(error),
    fetchShow,
  }
}
