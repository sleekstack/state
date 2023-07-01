import { Subscriber } from './subscriber'
import type { Disposer, ObserverLike } from './types'

/**
 * @description a simple observable implementation
 * @example
 * const observable = new Observable(subscriber => {
 *  subscriber.next(1);
 *  subscriber.next(2);
 *  subscriber.next(3);
 *  setTimeout(() => {
 *    subscriber.next(4);
 *    subscriber.complete();
 *  }, 1000);
 *
 *  return () => {
 *    console.log('disposed');
 *  }
 * });
 *
 * const unsubscribe = observable.subscribe({
 *   next: (x) => console.log(x),
 *   error: (err) => console.error(err),
 *   complete: () => console.log('done')
 * });
 *
 * setTimeout(() => {
 *  unsubscribe();
 * });
 */
export class Observable<T> {
  constructor(
    _subscribe?: (subscriber: Subscriber<T>) => Disposer | void
  ) {
    if (_subscribe) {
      this._subscribe = _subscribe
    }
  }

  protected _subscribe(subscriber: Subscriber<T>): Disposer | void {}

  private _trySubscribe(subscriber: Subscriber<T>) {
    try {
      return this._subscribe(subscriber)
    } catch (err) {
      subscriber.error(err)
    }
  }

  protected subscriberClass = Subscriber

  protected makeSubscriber(observerLike: ObserverLike<T> | Subscriber<T>) {
    if (observerLike instanceof Subscriber) {
      return observerLike
    }

    return new this.subscriberClass(observerLike)
  }

  /**
   * @description subscribe to the observable
   * @param observerLike
   * @returns a disposer
   */
  subscribe(observerLike: ObserverLike<T> | Subscriber<T>): Disposer {
    const subscriber = this.makeSubscriber(observerLike)

    subscriber.dispose = this._trySubscribe(subscriber)

    return () => {
      subscriber.unsubscribe()
    }
  }

  /**
   * @description map the current observable to a new observable
   */
  map<U>(fn: (value: T) => U): Observable<U> {
    return new Observable(subscriber => {
      return this.subscribe({
        next: (value: T) => {
          subscriber.next(fn(value))
        },
        error: err => {
          subscriber.error(err)
        },
        complete: () => {
          subscriber.complete()
        }
      })
    })
  }
}
