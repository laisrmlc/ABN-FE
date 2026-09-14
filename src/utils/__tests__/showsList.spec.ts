import { afterEach, describe, expect, it, vi } from 'vitest'
import { getShowInfo, getShows, sortByRating } from '../showsList'
import { MOCK_SHOWS } from '@/utils/constants'

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

describe('getShows', () => {
  it('returns the parsed shows on a successful response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(MOCK_SHOWS) }),
    )

    await expect(getShows()).resolves.toEqual(MOCK_SHOWS)
  })

  it('returns null when the response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

    await expect(getShows()).resolves.toBeNull()
  })
})

describe('getShowInfo', () => {
  it('returns the parsed show on a successful response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(MOCK_SHOWS[0]) }),
    )

    await expect(getShowInfo('1')).resolves.toEqual(MOCK_SHOWS[0])
  })

  it('returns null when the response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

    await expect(getShowInfo('1')).resolves.toBeNull()
  })

  it('propagates a timeout error from an aborted request', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new DOMException('signal timed out', 'TimeoutError')),
    )

    await expect(getShowInfo('1')).rejects.toThrow('signal timed out')
  })
})
