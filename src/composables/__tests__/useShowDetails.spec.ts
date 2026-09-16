import { afterEach, describe, expect, it, vi } from 'vitest'
import { useShowDetails } from '../useShowDetails'
import { getShowInfo } from '@/utils/showsList'
import { MOCK_SHOWS } from '@/test/fixtures/shows'

vi.mock('@/utils/showsList', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/utils/showsList')>()
  return { ...actual, getShowInfo: vi.fn() }
})

describe('useShowDetails', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('starts with no selected show and no loading/error state', () => {
    const { selectedShow, loading, error } = useShowDetails()

    expect(selectedShow.value).toBeNull()
    expect(loading.value).toBe(false)
    expect(error.value).toBe(false)
  })

  it('sets the selected show on a successful fetch', async () => {
    vi.mocked(getShowInfo).mockResolvedValue(MOCK_SHOWS[0]!)

    const { selectedShow, loading, error, fetchShow } = useShowDetails()
    await fetchShow('1')

    expect(selectedShow.value?.name).toBe('Breaking Bad')
    expect(loading.value).toBe(false)
    expect(error.value).toBe(false)
  })

  it('leaves the selected show null, without setting the error flag, when the fetch resolves with null', async () => {
    vi.mocked(getShowInfo).mockResolvedValue(null)

    const { selectedShow, error, fetchShow } = useShowDetails()
    await fetchShow('5000')

    expect(selectedShow.value).toBeNull()
    expect(error.value).toBe(false)
  })

  it('sets the error flag when the fetch throws', async () => {
    vi.mocked(getShowInfo).mockRejectedValue(new DOMException('signal timed out', 'TimeoutError'))

    const { selectedShow, error, loading, fetchShow } = useShowDetails()
    await fetchShow('1')

    expect(error.value).toBe(true)
    expect(selectedShow.value).toBeNull()
    expect(loading.value).toBe(false)
  })
})
