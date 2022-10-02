import { deferred } from "../deps/std/async.ts";

export type WatchHandler<Event> = (event: Event) => void;
export type CreateWatchHandler<Event> = (stop: () => void) => WatchHandler<Event>;

export function mapCreateWatchHandler<From, Into>(
  createWatchHandler: CreateWatchHandler<Into>,
  map: (message: From) => Into,
): CreateWatchHandler<From> {
  return (close) => {
    const listenerCb = createWatchHandler(close);
    return (message) => {
      listenerCb(map(message));
    };
  };
}

export type WatchIter<T> = CreateWatchHandler<T> & AsyncIterable<T>;

export function watchIter<T>(): WatchIter<T> {
  const queue: T[] = [];
  const cbs: ((value: IteratorYieldResult<T>) => void)[] = [];
  const onDoneContainer: { onDone?: () => void } = {};
  const createWatchHandler: CreateWatchHandler<T> = (stop) => {
    onDoneContainer.onDone = stop;
    return (value) => {
      const cb = cbs.shift();
      if (cb) {
        cb({
          done: false,
          value,
        });
      } else {
        queue.push(value);
      }
    };
  };
  const iter: AsyncIterableIterator<T> = {
    async next() {
      if (queue.length) {
        return {
          done: false,
          value: queue.shift()!,
        };
      }
      const pending = deferred<IteratorYieldResult<T>>();
      cbs.push(pending.resolve);
      return await pending;
    },
    return() {
      onDoneContainer?.onDone?.();
      return Promise.resolve({
        done: true as const,
        value: undefined,
      });
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
  return Object.assign(createWatchHandler, iter);
}
