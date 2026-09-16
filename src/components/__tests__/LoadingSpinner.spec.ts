import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import LoadingSpinner from '../LoadingSpinner.vue'

describe('LoadingSpinner', () => {
  it('announces "Loading…" through a status role', () => {
    const wrapper = mount(LoadingSpinner)

    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.text()).toBe('Loading…')
  })
})
