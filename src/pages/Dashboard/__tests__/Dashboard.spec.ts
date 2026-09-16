import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import Dashboard from '../Dashboard.vue'
import { getShows } from '@/utils/showsList'
import { MOCK_SHOWS } from '@/test/fixtures/shows'

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

const ALL_TITLES_BY_RATING = [
  'Breaking Bad',
  'The Office',
  'Better Call Saul',
  'Stranger Things',
  'Cursed Sitcom',
]

describe('Dashboard', () => {
  beforeEach(() => {
    vi.mocked(getShows).mockResolvedValue(MOCK_SHOWS)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('loads the shows and renders them sorted by rating', async () => {
    const wrapper = await mountDashboard()

    expect(cardTitles(wrapper)).toEqual(ALL_TITLES_BY_RATING)
  })

  it.each([
    { control: 'input', value: 'office', expected: ['The Office'] },
    { control: 'select', value: 'Comedy', expected: ['The Office', 'Cursed Sitcom'] },
  ])(
    'filters the list down to shows matching $control "$value"',
    async ({ control, value, expected }) => {
      const wrapper = await mountDashboard()

      await wrapper.find(control).setValue(value)

      expect(cardTitles(wrapper)).toEqual(expected)
    },
  )

  it('renders the empty state, without a title or link, when nothing matches the search box', async () => {
    const wrapper = await mountDashboard()

    await wrapper.find('input').setValue('nonexistent show')

    expect(cardTitles(wrapper)).toEqual([])
    expect(wrapper.find('.empty-state').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Page not found')
    expect(wrapper.findComponent(RouterLinkStub).exists()).toBe(false)
  })

  it('goes back to the full list sorted by rating when "All genres" is picked again', async () => {
    const wrapper = await mountDashboard()

    await wrapper.find('select').setValue('Drama')
    await wrapper.find('select').setValue('all')

    expect(cardTitles(wrapper)).toEqual(ALL_TITLES_BY_RATING)
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
