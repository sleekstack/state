import { describe, expect, test, vi  } from 'vitest'
import { Observable } from '../src/observable'
import { Subscriber } from '../src/subscriber'

describe('observable', () => {
  test('basic', (context) => {
    const observable = new Observable<number>(subscriber => {
      subscriber.next(1)
      subscriber.complete()
    })

    const mock = vi.fn()

    observable.subscribe({
      next: (x) => {
        expect(x).toBe(1)
      },
      complete: mock
    })

    expect(mock).toBeCalled()
  })

  test('unsubscribe', (context) => {
    const dispose = vi.fn()

    const observable = new Observable<number>(subscriber => {
      subscriber.next(1)
      subscriber.complete()

      return dispose
    })

    const complete = vi.fn()

    const unsubscribe = observable.subscribe({
      next: (x) => {
        expect(x).toBe(1)
      },
      complete
    })

    unsubscribe()

    expect(complete).toBeCalled()
    expect(dispose).toBeCalled()
  })

  test('map', (context) => {
    const observable = new Observable<number>(subscriber => {
      subscriber.next(1)
      subscriber.complete()
    }).map(x => x + 1)

    const mock = vi.fn()

    observable.subscribe({
      next: (x) => {
        expect(x).toBe(2)
      },
      complete: mock
    })

    expect(mock).toBeCalled()
  })
})
