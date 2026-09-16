import { afterEach, describe, expect, it, vi } from 'vitest'
import { useShows } from '../useShows'
import { getShows } from '@/utils/showsList'
import { MOCK_SHOWS } from '@/test/fixtures/shows'

vi.mock('@/utils/showsList', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/utils/showsList')>()
  return { ...actual, getShows: vi.fn() }
})

describe('useShows', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('starts with an empty list and no loading/error state', () => {
    const { shows, loading, error } = useShows()

    expect(shows.value).toEqual([])
    expect(loading.value).toBe(false)
    expect(error.value).toBe(false)
  })

  it('populates shows sorted by rating on a successful fetch', async () => {
    vi.mocked(getShows).mockResolvedValue([...MOCK_SHOWS].reverse())

    const { shows, loading, error, fetchShows } = useShows()
    await fetchShows()

    expect(shows.value.map((show) => show.name)).toEqual(MOCK_SHOWS.map((show) => show.name))
    expect(loading.value).toBe(false)
    expect(error.value).toBe(false)
  })

  it('sets the error flag when the fetch throws', async () => {
    vi.mocked(getShows).mockRejectedValue(new DOMException('signal timed out', 'TimeoutError'))

    const { error, loading, fetchShows } = useShows()
    await fetchShows()

    expect(error.value).toBe(true)
    expect(loading.value).toBe(false)
  })
})
