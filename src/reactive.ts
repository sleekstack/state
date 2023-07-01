import { Observable } from './observable'
import { Subscriber } from './subscriber'
import { Observer } from './types'

/**
 * @description a reactive value that can be subscribed to and updated
 * @example
 * const state = new Reactive(0)
 *
 * state.subscribe({
 *    next: value => {
 *      console.log(value)
 *    }
 *  })
 *
 *  state.value = 1
 */
export class Reactive<T = any> extends Observable<T> implements Observer<T> {
  constructor(
    private _value: T,
    private _key: string | Symbol = Symbol()
  ) {
    super()
  }

  protected subscribers: Subscriber<T>[] = []

  _subscribe(subscriber: Subscriber<T>) {
    this.subscribers.push(subscriber)

    return () => {
      const index = this.subscribers.indexOf(subscriber)
      if (index > -1) {
        this.subscribers.splice(index, 1)
      }
    }
  }

  map<U>(fn: (value: T) => U): Reactive<U> {
    const reactive = new Reactive(fn(this._value))

    this.subscribe({
      next: (value: T) => {
        reactive.next(fn(value))
      },
      error: (err: any) => {
        reactive.error(err)
      },
      complete: () => {
        reactive.complete()
      }
    })

    return reactive
  }

  get value() {
    return this._value
  }

  set value(value: T) {
    this.next(value)
  }

  next(value: T) {
    this._value = value
    for (let i = 0; i < this.subscribers.length; i++) {
      const subscriber = this.subscribers[i]
      subscriber.next(value)
    }
  }

  error(err: any) {
    for (let i = 0; i < this.subscribers.length; i++) {
      const subscriber = this.subscribers[i]
      subscriber.error(err)
    }
  }

  complete() {
    for (let i = 0; i < this.subscribers.length; i++) {
      const subscriber = this.subscribers[i]
      subscriber.complete()
    }
  }
}

export function reactive<T>(value: T, key?: string | Symbol): Reactive<T> {
  return new Reactive(value, key)
}
