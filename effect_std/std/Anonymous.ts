import { Effect } from "/effect/Base.ts";

export class AnonymousEffect<
  D extends unknown[],
  A,
  E extends Error,
  R,
> extends Effect<D, A, Error extends E ? never : E, R> {}
