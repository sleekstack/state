import { describe, expect, test, vi } from 'vitest'
import { reactive } from '../src'

describe('reactive', () => {
  test('basic', (context) => {
    const state = reactive(0)

    const mock = vi.fn()

    state.subscribe({
      next: (x) => {
        expect(x).toBe(1)
      },
      complete: mock
    })

    state.value = 1

    expect(mock).not.toBeCalled()
  })

  test('unsubscribe', (context) => {
    const state = reactive(0)

    const complete = vi.fn()

    const unsubscribe = state.subscribe({
      next: (x) => {
        expect(x).toBe(1)
      },
      complete
    })

    unsubscribe()

    state.value = 1

    expect(complete).toBeCalled()
  })

  test('map', (context) => {
    const state = reactive(0)

    const mappedState = state.map(x => x + 1)

    const mock = vi.fn()

    expect(state.value).toBe(0)
    expect(mappedState.value).toBe(1)

    state.subscribe({
      next: (x) => expect(x).toBe(1),
      complete: mock
    })

    mappedState.subscribe({
      next: (x) => expect(x).toBe(2),
      complete: mock
    })

    state.value = 1

    expect(mock).not.toBeCalled()
  })
})
