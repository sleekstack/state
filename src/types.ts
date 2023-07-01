export interface Disposer {
  (): void
}

export interface Observer<T> {
  next(value: T): void

  error(err: any): void

  complete(): void
}

export type ObserverLike<T> = Partial<Observer<T>> | Observer<T>['next']
