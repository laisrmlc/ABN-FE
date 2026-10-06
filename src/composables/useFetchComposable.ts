import { onUnmounted, ref, shallowReadonly } from 'vue'

export const useFetchComposable = () => {
  const loading = ref(false)
  const error = ref(false)

  let controller: AbortController | null = null
  onUnmounted(() => controller?.abort())

  const execute = async <T>(
    request: (signal: AbortSignal) => Promise<T>,
  ): Promise<T | undefined> => {
    // Abort previous signal to avoid race condition
    controller?.abort()
    const currentController = new AbortController()
    controller = currentController

    try {
      loading.value = true
      error.value = false
      const result = await request(currentController.signal)
      // Ignore results from requests superseded by a newer call
      if (currentController.signal.aborted) return
      return result
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        console.warn('Request aborted:', err)
        return
      }
      if (currentController !== controller) return
      console.error(err)
      error.value = true
    } finally {
      if (currentController === controller) {
        loading.value = false
      }
    }
  }

  return {
    loading: shallowReadonly(loading),
    error: shallowReadonly(error),
    execute,
  }
}
