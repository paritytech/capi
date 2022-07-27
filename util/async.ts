import { Deferred } from "../deps/std/async.ts";

export function resolveOnCall<F extends (...args: any[]) => any, T>(
  deferred: Deferred<T>,
  fn: F,
  getResolution?: () => T,
): F {
  return ((...args: any[]) => {
    deferred.resolve(getResolution?.());
    return fn(...args);
  }) as F;
}

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
