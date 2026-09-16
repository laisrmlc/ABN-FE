import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DashboardHeader from '../DashboardHeader.vue'

describe('DashboardHeader', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('lists "All genres" plus every genre it was given', () => {
    const wrapper = mount(DashboardHeader, {
      props: { genres: ['Comedy', 'Drama'], selectedGenre: 'all' },
    })

    const options = wrapper.findAll('option').map((option) => option.text())

    expect(options).toEqual(['All genres', 'Comedy', 'Drama'])
  })

  it('emits update:selectedGenre when a different genre is picked', async () => {
    const wrapper = mount(DashboardHeader, {
      props: { genres: ['Comedy', 'Drama'], selectedGenre: 'all' },
    })

    await wrapper.find('select').setValue('Drama')

    expect(wrapper.emitted('update:selectedGenre')?.[0]).toEqual(['Drama'])
  })

  it('emits search with the typed value once the debounce delay has passed', async () => {
    const wrapper = mount(DashboardHeader, {
      props: { genres: [], selectedGenre: 'all' },
    })

    expect(wrapper.find('label[for="filter-by-name-input"]').text()).toBe(
      'Filter shows list by name',
    )

    await wrapper.find('input').setValue('office')
    vi.advanceTimersByTime(200)

    expect(wrapper.emitted('search')?.[0]).toEqual(['office'])
  })
})
