import { deferred } from "../deps/std/async.ts";

export type Listener<Event> = (event: Event) => void;
export type CreateListener<Event> = (stop: () => void) => Listener<Event>;

export function mapCreateListener<From, Into>(
  createListener: CreateListener<Into>,
  map: (message: From) => Into,
): CreateListener<From> {
  return (close) => {
    const listenerCb = createListener(close);
    return (message) => {
      listenerCb(map(message));
    };
  };
}

export type WatchIter<T> = CreateListener<T> & AsyncIterable<T>;

export function watchIter<T>(): WatchIter<T> {
  const queue: T[] = [];
  const cbs: ((value: IteratorYieldResult<T>) => void)[] = [];
  const onDoneContainer: { onDone?: () => void } = {};
  const createWatchHandler: CreateListener<T> = (stop) => {
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
