import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ShowDetailsHeader from '../ShowDetailsHeader.vue'

const push = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push }),
}))

describe('ShowDetailsHeader', () => {
  it('sends the visitor back to the dashboard when the button is clicked', async () => {
    const wrapper = mount(ShowDetailsHeader)

    await wrapper.find('button').trigger('click')

    expect(push).toHaveBeenCalledWith({ name: 'dashboard' })
  })
})
