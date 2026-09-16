import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { reactive } from 'vue'
import ShowDetailsContent from '../ShowDetailsContent.vue'
import { getShowInfo } from '@/utils/showsList'
import { MOCK_SHOWS } from '@/test/fixtures/shows'

const routeParams = reactive({ id: '1' })

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
    vi.restoreAllMocks()
  })

  it.each<{ id: string; label: string; includes: string[]; excludes: string[] }>([
    {
      id: '2', // The Office: network null, webChannel null
      label: 'a show with neither a network nor a web channel',
      includes: ['Not available'],
      excludes: [],
    },
    {
      id: '1', // Breaking Bad: network AMC, airs Sunday at 21:00
      label: 'a show that airs weekly on a network',
      includes: ['Every Sunday', '21:00'],
      excludes: [],
    },
    {
      id: '4', // Stranger Things: webChannel Netflix, no network
      label: 'a streaming-only show',
      includes: [],
      excludes: ['Every'],
    },
  ])('shows the right broadcast info for $label', async ({ id, includes, excludes }) => {
    routeParams.id = id

    const text = (await mountContent()).text()

    includes.forEach((snippet) => expect(text).toContain(snippet))
    excludes.forEach((snippet) => expect(text).not.toContain(snippet))
  })

  it('shows the not found page when the id in the url does not match any show', async () => {
    routeParams.id = '5000'

    const wrapper = await mountContent()

    expect(wrapper.text()).toContain('Page not found')
    expect(wrapper.find('[role="status"]').exists()).toBe(false)
    expect(wrapper.find('#show-title').exists()).toBe(false)
    expect(document.title).toBe('Page not found | TV Shows')
  })

  it('shows an error message, not the not-found page, when the fetch fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(getShowInfo).mockRejectedValue(new DOMException('signal timed out', 'TimeoutError'))

    const wrapper = await mountContent()

    expect(wrapper.find('[role="alert"]').text()).toContain(
      'Something went wrong while loading this show',
    )
    expect(wrapper.text()).not.toContain('Page not found')
    expect(wrapper.find('#show-title').exists()).toBe(false)
    expect(consoleError).toHaveBeenCalledOnce()
  })

  it('refetches and updates the page when the route id changes without remounting', async () => {
    routeParams.id = '1'
    const wrapper = await mountContent()

    expect(wrapper.find('#show-title').text()).toBe('Breaking Bad')

    routeParams.id = '4' // Stranger Things
    await flushPromises()

    expect(wrapper.find('#show-title').text()).toBe('Stranger Things')
  })
})
