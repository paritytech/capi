// import { deferred } from "../deps/std/async.ts";

export type Listener<Event, This = any> = (this: This, event: Event) => void;

export function contramapListener<This>() {
  return <From, Into>(
    listener: Listener<Into, This>,
    map: (this: This, message: From) => Into,
  ): Listener<From> => {
    return function(e: From) {
      return listener.apply(this, [map.apply(this, [e])]);
    };
  };
}

// export type WatchIter<T> = CreateListener<T> & AsyncIterable<T>;

// export function watchIter<T>(): WatchIter<T> {
//   const queue: T[] = [];
//   const cbs: ((value: IteratorYieldResult<T>) => void)[] = [];
//   const onDoneContainer: { onDone?: () => void } = {};
//   const createWatchHandler: CreateListener<T> = (stop) => {
//     onDoneContainer.onDone = stop;
//     return (value) => {
//       const cb = cbs.shift();
//       if (cb) {
//         cb({
//           done: false,
//           value,
//         });
//       } else {
//         queue.push(value);
//       }
//     };
//   };
//   const iter: AsyncIterableIterator<T> = {
//     async next() {
//       if (queue.length) {
//         return {
//           done: false,
//           value: queue.shift()!,
//         };
//       }
//       const pending = deferred<IteratorYieldResult<T>>();
//       cbs.push(pending.resolve);
//       return await pending;
//     },
//     return() {
//       onDoneContainer?.onDone?.();
//       return Promise.resolve({
//         done: true as const,
//         value: undefined,
//       });
//     },
//     [Symbol.asyncIterator]() {
//       return this;
//     },
//   };
//   return Object.assign(createWatchHandler, iter);
// }
