import { Deferred, deferred } from "../deps/std/async.ts"

export function cbToAsyncIter<T>() {
  const abortController = new AbortController()
  const queue: IteratorResult<T>[] = []
  let waiting: Deferred<IteratorResult<T>> | undefined
  let keepAlive = true
  const _iter: AsyncIterable<T> = {
    [Symbol.asyncIterator]: () => ({
      async next() {
        if (queue.length) return queue.shift()!
        if (!keepAlive) {
          abortController.abort()
          return { done: true, value: undefined }
        }
        return waiting = deferred()
      },
      async return(value) {
        abortController.abort()
        return { done: true, value }
      },
      async throw(value) {
        abortController.abort()
        return { done: true, value }
      },
    }),
  }
  const iter = (async function*() {
    yield* _iter
  })()
  const cb = (value: T) => {
    if (waiting) {
      waiting.resolve({ done: false, value })
      waiting = undefined
    } else {
      queue.push({ done: false, value })
    }
  }
  abortController.signal.addEventListener("abort", () => {
  })
  return {
    cb,
    iter,
    signal: abortController.signal,
    end: () => {
      keepAlive = false
      if (waiting) {
        waiting.resolve({ done: true, value: undefined })
      }
    },
  }
}
