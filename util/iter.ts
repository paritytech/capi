import { deferred } from "../deps/std/async.ts";

export class Iter<T> implements AsyncIterableIterator<T> {
  #queue: T[] = [];
  #cbs: ((value: IteratorYieldResult<T>) => void)[] = [];
  onDone?: () => void;

  push = (value: T): void => {
    const cb = this.#cbs.shift();
    if (cb) {
      cb({
        done: false,
        value,
      });
    } else {
      this.#queue.push(value);
    }
  };

  async next(): Promise<IteratorResult<T>> {
    if (this.#queue.length) {
      return {
        done: false,
        value: this.#queue.shift()!,
      };
    }
    const pending = deferred<IteratorYieldResult<T>>();
    this.#cbs.push(pending.resolve);
    return await pending;
  }

  return(): Promise<IteratorReturnResult<undefined>> {
    this.onDone?.();
    return Promise.resolve({
      done: true as const,
      value: undefined,
    });
  }

  [Symbol.asyncIterator]() {
    return this;
  }
}
