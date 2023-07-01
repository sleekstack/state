import { describe, test, expect, vi } from 'vitest'
import { reactive } from '../src'
import { effect } from '../src/effect'

describe('reactive', () => {
  test('basic', (context) => {
    const state1 = reactive(0)
    const state2 = reactive(1)

    effect(() => {
      state1.value = state2.value + 1
    }, [state1, state2])

    expect(state1.value).toBe(0)

    state2.value = 2

    expect(state1.value).toBe(3)
  })

  test('cycle', async () => {
    const state1 = reactive(0, 'state1')
    const state2 = reactive(0, 'state2')

    const mockDisposer = vi.fn()

    const mockEffect = vi.fn(() => {
      state1.value = state2.value + 1
      state2.value = state1.value + 1

      return mockDisposer
    })

    effect(mockEffect, [state1, state2])

    expect(state1.value).toBe(0)
    expect(state2.value).toBe(0)

    expect(() => state1.value = 1).toThrow('cycle detected')
  })
})
