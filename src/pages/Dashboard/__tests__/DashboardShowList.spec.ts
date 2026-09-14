import { describe, expect, it } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import DashboardShowList from '../DashboardShowList.vue'
import { MOCK_SHOWS } from '@/utils/constants'

describe('DashboardShowList', () => {
  it('renders a card for every show it is given with name and genres', () => {
    const wrapper = mount(DashboardShowList, {
      props: { filteredShows: MOCK_SHOWS.slice(0, 2), filterAnnouncement: '2 shows found' },
      global: { stubs: { RouterLink: RouterLinkStub } },
    })

    expect(wrapper.findAll('.show-card')).toHaveLength(2)
    expect(wrapper.find('.show-card__title').text()).toBe('Breaking Bad')
    expect(wrapper.text()).toContain('Drama, Crime')
  })

  it('renders no cards and shows the not-found page when there are no shows left after filtering', () => {
    const wrapper = mount(DashboardShowList, {
      props: { filteredShows: [], filterAnnouncement: '0 shows found' },
      global: { stubs: { RouterLink: RouterLinkStub } },
    })

    expect(wrapper.findAll('.show-card')).toHaveLength(0)
    expect(wrapper.text()).toContain('No shows match your search.')
  })
})
