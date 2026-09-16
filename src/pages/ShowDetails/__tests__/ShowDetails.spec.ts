import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ShowDetails from '../ShowDetails.vue'

const push = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push }),
}))

describe('ShowDetails', () => {
  it('sends the visitor back to the dashboard when the button is clicked', async () => {
    const wrapper = mount(ShowDetails, {
      global: { stubs: { ShowDetailsContent: true } },
    })

    await wrapper.find('button').trigger('click')

    expect(push).toHaveBeenCalledWith({ name: 'dashboard' })
  })
})
