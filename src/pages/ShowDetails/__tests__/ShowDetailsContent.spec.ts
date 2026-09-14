import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import ShowDetailsContent from '../ShowDetailsContent.vue'
import { getShowInfo } from '@/utils/showsList'
import { MOCK_SHOWS } from '@/utils/constants'

const routeParams = vi.hoisted(() => ({ id: '1' }))

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: routeParams }),
}))

vi.mock('@/utils/showsList', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/utils/showsList')>()
  return { ...actual, getShowInfo: vi.fn() }
})

const mountContent = async () => {
  const wrapper = mount(ShowDetailsContent, {
    global: { stubs: { RouterLink: RouterLinkStub } },
  })
  await flushPromises()
  return wrapper
}

describe('ShowDetailsContent', () => {
  beforeEach(() => {
    routeParams.id = '1'
    vi.mocked(getShowInfo).mockImplementation(
      async (id) => MOCK_SHOWS.find((show) => show.id.toString() === id) ?? null,
    )
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('shows "Not available" when a show has neither a network nor a web channel', async () => {
    routeParams.id = '2' // The Office: network null, webChannel null

    const wrapper = await mountContent()

    expect(wrapper.text()).toContain('Not available')
  })

  it('shows the weekly broadcast schedule for shows that air on a network', async () => {
    routeParams.id = '1' // Breaking Bad: network AMC, airs Sunday at 21:00

    const wrapper = await mountContent()

    expect(wrapper.text()).toContain('Every Sunday')
    expect(wrapper.text()).toContain('21:00')
  })

  it('does not show a broadcast schedule for a streaming-only show', async () => {
    routeParams.id = '4' // Stranger Things: webChannel Netflix, no network

    const wrapper = await mountContent()

    expect(wrapper.text()).not.toContain('Every')
  })

  it('shows the not found page when the id in the url does not match any show', async () => {
    routeParams.id = '5000'

    const wrapper = await mountContent()

    expect(wrapper.text()).toContain('Page not found')
    expect(wrapper.find('[role="status"]').exists()).toBe(false)
    expect(wrapper.find('#show-title').exists()).toBe(false)
  })
})
