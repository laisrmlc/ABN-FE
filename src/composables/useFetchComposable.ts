import { onUnmounted, ref, shallowReadonly } from 'vue'

export const useFetchComposable = () => {
  const loading = ref(false)
  const error = ref(false)

  const controller = new AbortController()
  onUnmounted(() => controller.abort())

  const execute = async <T>(
    request: (signal: AbortSignal) => Promise<T>,
  ): Promise<T | undefined> => {
    try {
      loading.value = true
      error.value = false
      return await request(controller.signal)
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
    loading: shallowReadonly(loading),
    error: shallowReadonly(error),
    execute,
  }
}
