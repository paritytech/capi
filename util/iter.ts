import { deferred } from "../_deps/async.ts";

export class Iter<T> implements AsyncIterableIterator<T> {
  #queue: T[] = [];
  #cbs: ((value: IteratorYieldResult<T>) => void)[] = [];

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

  [Symbol.asyncIterator]() {
    return this;
  }
}

export function iter<T>(): Iter<T> {
  return new Iter();
}
