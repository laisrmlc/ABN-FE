import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import Dashboard from '../Dashboard.vue'
import { getShows } from '@/utils/showsList'
import { MOCK_SHOWS } from '@/utils/constants'

vi.mock('@/utils/showsList', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/utils/showsList')>()
  return { ...actual, getShows: vi.fn() }
})

vi.mock('@/utils/debounce', () => ({
  debounce: (fn: (...args: unknown[]) => void) => fn,
}))

const mountDashboard = async () => {
  const wrapper = mount(Dashboard, {
    global: { stubs: { RouterLink: RouterLinkStub } },
  })
  await flushPromises()
  return wrapper
}

const cardTitles = (wrapper: Awaited<ReturnType<typeof mountDashboard>>) =>
  wrapper.findAll('.show-card__title').map((title) => title.text())

describe('Dashboard', () => {
  beforeEach(() => {
    vi.mocked(getShows).mockResolvedValue(MOCK_SHOWS)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('loads the shows and renders them sorted by rating', async () => {
    const wrapper = await mountDashboard()

    expect(cardTitles(wrapper)).toEqual([
      'Breaking Bad',
      'The Office',
      'Better Call Saul',
      'Stranger Things',
      'Cursed Sitcom',
    ])
  })

  it('filters the list down to shows that matches the search box', async () => {
    const wrapper = await mountDashboard()

    await wrapper.find('input').setValue('office')

    expect(cardTitles(wrapper)).toEqual(['The Office'])
  })

  it('renders the not found state, without a title or link, when nothing matches the search box', async () => {
    const wrapper = await mountDashboard()

    await wrapper.find('input').setValue('nonexistent show')

    expect(cardTitles(wrapper)).toEqual([])
    expect(wrapper.find('.page-not-found').exists()).toBe(true)
    expect(wrapper.find('.page-not-found h1').exists()).toBe(false)
    expect(wrapper.findComponent(RouterLinkStub).exists()).toBe(false)
  })

  it('filters the list down to shows in the selected genre', async () => {
    const wrapper = await mountDashboard()

    await wrapper.find('select').setValue('Comedy')

    expect(cardTitles(wrapper)).toEqual(['The Office', 'Cursed Sitcom'])
  })

  it('goes back to the full list sorted by rating swhen "All genres" is picked again', async () => {
    const wrapper = await mountDashboard()

    await wrapper.find('select').setValue('Drama')
    await wrapper.find('select').setValue('all')

    expect(cardTitles(wrapper)).toEqual([
      'Breaking Bad',
      'The Office',
      'Better Call Saul',
      'Stranger Things',
      'Cursed Sitcom',
    ])
  })

  it('combines the genre filter and the name search', async () => {
    const wrapper = await mountDashboard()

    await wrapper.find('select').setValue('Drama')
    await wrapper.find('input').setValue('stranger')

    expect(cardTitles(wrapper)).toEqual(['Stranger Things'])
  })

  it('builds the genre dropdown from the shows', async () => {
    const wrapper = await mountDashboard()

    const options = wrapper.findAll('option').map((option) => option.text())

    expect(options).toEqual(['All genres', 'Comedy', 'Crime', 'Drama', 'Horror'])
  })
})
