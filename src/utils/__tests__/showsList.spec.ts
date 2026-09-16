import { afterEach, describe, expect, it, vi } from 'vitest'
import { getShowInfo, getShows, sortByRating } from '../showsList'
import { MOCK_SHOWS } from '@/test/fixtures/shows'

describe('sortByRating', () => {
  it('orders shows from highest rating to lowest', () => {
    const sorted = sortByRating([...MOCK_SHOWS].reverse())

    expect(sorted.map((show) => show.name)).toEqual(MOCK_SHOWS.map((show) => show.name))
  })

  it('handles an empty list', () => {
    expect(sortByRating([])).toEqual([])
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe.each([
  { name: 'getShows', call: () => getShows(new AbortController().signal), payload: MOCK_SHOWS },
  {
    name: 'getShowInfo',
    call: () => getShowInfo('1', new AbortController().signal),
    payload: MOCK_SHOWS[0],
  },
])('$name', ({ call, payload }) => {
  it('returns the parsed payload on a successful response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(payload) }),
    )

    await expect(call()).resolves.toEqual(payload)
  })

  it('throws when the response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    await expect(call()).rejects.toThrow('500')
  })
})

describe('getShowInfo', () => {
  it('returns null when the show does not exist (404)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }))

    await expect(getShowInfo('5000', new AbortController().signal)).resolves.toBeNull()
  })

  it('propagates a timeout error from an aborted request', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new DOMException('signal timed out', 'TimeoutError')),
    )

    await expect(getShowInfo('1', new AbortController().signal)).rejects.toThrow('signal timed out')
  })
})
