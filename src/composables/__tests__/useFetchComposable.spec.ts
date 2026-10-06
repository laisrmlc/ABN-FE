import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { useFetchComposable } from '../useFetchComposable'

const abortableRequest = <T>() => {
  let resolve!: (value: T) => void
  let receivedSignal!: AbortSignal

  const request = (signal: AbortSignal) =>
    new Promise<T>((res, reject) => {
      receivedSignal = signal
      resolve = res
      signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')))
    })

  return { request, resolve: (value: T) => resolve(value), signal: () => receivedSignal }
}

describe('useFetchComposable', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns the request result and resets loading', async () => {
    const { loading, error, execute } = useFetchComposable()

    const result = await execute(async () => 'data')

    expect(result).toBe('data')
    expect(loading.value).toBe(false)
    expect(error.value).toBe(false)
  })

  it('sets loading while the request is in flight', async () => {
    const { loading, execute } = useFetchComposable()
    const pending = abortableRequest<string>()

    const call = execute(pending.request)
    expect(loading.value).toBe(true)

    pending.resolve('data')
    await call
    expect(loading.value).toBe(false)
  })

  it('sets the error flag when the request throws', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { loading, error, execute } = useFetchComposable()

    const result = await execute(async () => {
      throw new Error('boom')
    })

    expect(result).toBeUndefined()
    expect(error.value).toBe(true)
    expect(loading.value).toBe(false)
  })

  it('clears a previous error when a new request starts', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { error, execute } = useFetchComposable()

    await execute(async () => {
      throw new Error('boom')
    })
    await execute(async () => 'data')

    expect(error.value).toBe(false)
  })

  it('aborts the previous request when a new one starts', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { execute } = useFetchComposable()
    const first = abortableRequest<string>()

    const firstCall = execute(first.request)
    await execute(async () => 'second')

    expect(first.signal().aborted).toBe(true)
    await expect(firstCall).resolves.toBeUndefined()
  })

  it('keeps loading true while the newer request is still in flight', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { loading, execute } = useFetchComposable()
    const first = abortableRequest<string>()
    const second = abortableRequest<string>()

    const firstCall = execute(first.request)
    const secondCall = execute(second.request)
    await firstCall

    expect(loading.value).toBe(true)

    second.resolve('second')
    await secondCall
    expect(loading.value).toBe(false)
  })

  it('does not set the error flag when a stale request fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { error, execute } = useFetchComposable()
    let rejectFirst!: (reason: unknown) => void

    const firstCall = execute(
      () =>
        new Promise<string>((_, reject) => {
          rejectFirst = reject
        }),
    )
    const secondCall = execute(async () => 'second')

    rejectFirst(new Error('stale failure'))
    await Promise.all([firstCall, secondCall])

    expect(error.value).toBe(false)
  })

  it('does not return a stale result that resolves after being superseded', async () => {
    const { execute } = useFetchComposable()
    let resolveFirst!: (value: string) => void

    const firstCall = execute(
      () =>
        new Promise<string>((resolve) => {
          resolveFirst = resolve
        }),
    )
    const secondCall = execute(async () => 'second')

    resolveFirst('stale')

    await expect(firstCall).resolves.toBeUndefined()
    await expect(secondCall).resolves.toBe('second')
  })

  it('aborts the in-flight request when the component unmounts', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const pending = abortableRequest<string>()
    let call!: Promise<string | undefined>

    const wrapper = mount(
      defineComponent({
        setup() {
          const { execute } = useFetchComposable()
          call = execute(pending.request)
          return () => null
        },
      }),
    )

    wrapper.unmount()

    expect(pending.signal().aborted).toBe(true)
    await expect(call).resolves.toBeUndefined()
  })
})
