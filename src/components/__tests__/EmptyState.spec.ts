import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import EmptyState from '../EmptyState.vue'

describe('EmptyState', () => {
  it('renders the default message when none is given', () => {
    const wrapper = mount(EmptyState)

    expect(wrapper.text()).toBe('Sorry, the content you are looking for is not available.')
  })

  it('renders a custom message when one is given', () => {
    const wrapper = mount(EmptyState, { props: { message: 'No shows match your search.' } })

    expect(wrapper.text()).toBe('No shows match your search.')
  })
})
