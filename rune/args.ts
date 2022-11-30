import { _E, Future } from "./future.ts"

export type Args<X, A> = never extends X ? { [K in keyof A]: A[K] | Future<A[K], ArgsE<X>> }
  : X extends A ? X
  : { [K in keyof A]: A[K] }

export type ArgsE<X> = _E<X[X extends unknown[] ? number & keyof X : keyof X]>
