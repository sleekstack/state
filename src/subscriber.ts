import type { Disposer, Observer, ObserverLike } from './types'
import { noop } from './utils'

export class Subscriber<T> implements Observer<T> {
  constructor(
    observerLike: ObserverLike<T>
  ) {
    if (typeof observerLike === 'function')
      this._observer.next = observerLike
    else
      this._observer = { ...this._observer, ...observerLike }
  }

  private readonly _observer: Observer<T> = {
    next: noop,
    error: noop,
    complete: noop
  }

  private running = true

  private disposed = false

  public dispose?: Disposer | void

  next(value: T) {
    if (this.running) {
      try {
        this._observer.next(value)
      } catch (err) {
        this.error(err)
      }
    }
  }

  error(err: any) {
    if (this.running) {
      this._observer.error(err)
      this.unsubscribe()
    }
  }

  complete() {
    if (this.running) {
      this._observer.complete()
      this.running = false
    }
  }

  unsubscribe() {
    this.complete()

    if (!this.disposed) {
      this.dispose?.()
      this.disposed = true
    }
  }
}
