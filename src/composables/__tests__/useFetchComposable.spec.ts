import { afterEach, describe, expect, it, vi } from 'vitest'
import { useFetchComposable } from '../useFetchComposable'

describe('useFetchComposable', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('starts with no loading/error state', () => {
    const { loading, error } = useFetchComposable()

    expect(loading.value).toBe(false)
    expect(error.value).toBe(false)
  })

  it('returns the request result and passes an abort signal', async () => {
    const request = vi.fn().mockResolvedValue('data')

    const { loading, error, execute } = useFetchComposable()
    const result = await execute(request)

    expect(result).toBe('data')
    expect(request).toHaveBeenCalledWith(expect.any(AbortSignal))
    expect(loading.value).toBe(false)
    expect(error.value).toBe(false)
  })

  it('sets the error flag and returns undefined when the request throws', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const { loading, error, execute } = useFetchComposable()
    const result = await execute(() => Promise.reject(new Error('boom')))

    expect(result).toBeUndefined()
    expect(error.value).toBe(true)
    expect(loading.value).toBe(false)
  })

  it('does not set the error flag when the request is aborted', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})

    const { loading, error, execute } = useFetchComposable()
    const result = await execute(() => Promise.reject(new DOMException('aborted', 'AbortError')))

    expect(result).toBeUndefined()
    expect(error.value).toBe(false)
    expect(loading.value).toBe(false)
  })
})
