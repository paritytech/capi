import { _E, Future } from "./future.ts"

export type Args<X, A> = never extends X ? { [K in keyof A]: A[K] | Future<A[K], ArgsE<X>> }
  : X extends A ? X
  : never

export type ArgsE<X> = X extends unknown[] ? _E<X[number]> : _E<X[keyof X]>

export function resolveArgs<X, A>(args: Args<X, A>): { [K in keyof A]: Future<A[K], ArgsE<X>> }
export function resolveArgs(args: any): any {
  return args instanceof Array
    ? args.map(Future.resolve)
    : Object.fromEntries(Object.entries(args).map(([k, v]) => [k, Future.resolve(v)]))
}
