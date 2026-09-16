import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import App from '../App.vue'

import { getShows, getShowInfo } from '@/utils/showsList'
import { MOCK_SHOWS } from '@/test/fixtures/shows'

import { createRouter, createMemoryHistory } from 'vue-router'
import Dashboard from '@/pages/Dashboard/Dashboard.vue'
import ShowDetails from '@/pages/ShowDetails/ShowDetails.vue'
import NotFound from '@/pages/NotFound/NotFound.vue'

export const createTestRouter = () =>
  createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'dashboard', component: Dashboard },
      { path: '/show-details/:id', name: 'show-details', component: ShowDetails },
      { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
    ],
  })

vi.mock('@/utils/showsList', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/utils/showsList')>()
  return { ...actual, getShows: vi.fn(), getShowInfo: vi.fn() }
})

const visit = async (path: string) => {
  const router = createTestRouter()

  await router.push(path)
  await router.isReady()

  const wrapper = mount(App, {
    global: { plugins: [router], stubs: { RouterLink: RouterLinkStub } },
  })
  await flushPromises()
  return wrapper
}

describe('App', () => {
  beforeEach(() => {
    vi.mocked(getShows).mockResolvedValue(MOCK_SHOWS)
    vi.mocked(getShowInfo).mockImplementation(
      async (id) => MOCK_SHOWS.find((show) => show.id.toString() === id) ?? null,
    )
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders the dashboard at the root url', async () => {
    const wrapper = await visit('/')

    expect(wrapper.text()).toContain('TV SHOWS')
  })

  it('renders the matching show when visiting its details url', async () => {
    const wrapper = await visit('/show-details/1')

    expect(wrapper.find('#show-title').text()).toBe('Breaking Bad')
  })

  it('shows the "page not found" screen when visiting a show id that does not exist', async () => {
    const wrapper = await visit('/show-details/5000')

    expect(wrapper.text()).toContain('Page not found')
    expect(wrapper.find('[role="status"]').exists()).toBe(false)
    expect(wrapper.find('#show-title').exists()).toBe(false)
  })

  it('shows the "page not found" screen and updates the title when visiting an unknown route', async () => {
    const wrapper = await visit('/this-route-does-not-exist')

    expect(wrapper.text()).toContain('Page not found')
    expect(wrapper.text()).toContain('Go back to shows list')
    expect(document.title).toBe('Page not found | TV Shows')
  })
})
