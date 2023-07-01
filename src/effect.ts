import { Observable } from './observable'
import { Disposer } from './types'

export function effect(fn: () => Disposer | void, deps: Observable<any>[]): Disposer {
  const disposers: Disposer[] = []

  let isRunning = false
  const callback = () => {
    if (isRunning) {
      throw new Error('cycle detected')
    }
    isRunning = true
    const dispose = fn()
    isRunning = false
    return dispose
  }

  for (const dep of deps) {
    const dispose = dep.subscribe({
      next: callback,
      error: (err: any) => {
        throw err
      }
    })
    disposers.push(dispose)
  }

  return () => {
    for (const dispose of disposers) {
      dispose()
    }
  }
}
