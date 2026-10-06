import { ref, shallowReadonly } from 'vue'
import { getShowInfo } from '@/utils/showsList'
import { useFetchComposable } from '@/composables/useFetchComposable'
import type { Show } from '@/types/showTypes'

export const useShowDetails = () => {
  const selectedShow = ref<Show | null>(null)
  const { loading, error, execute } = useFetchComposable()

  const fetchShow = async (id: string) => {
    const result = await execute((signal) => getShowInfo(id, signal))
    if (result !== undefined) selectedShow.value = result
  }

  return {
    selectedShow: shallowReadonly(selectedShow),
    loading,
    error,
    fetchShow,
  }
}
