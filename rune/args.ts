import { _U, Rune } from "./rune.ts"

export type Args<X, A> = never extends X ? { [K in keyof A]: A[K] | Rune<A[K], ArgsU<X>> }
  : X extends A ? X
  : never

export type ArgsU<X> = X extends unknown[] ? _U<X[number]> : _U<X[keyof X]>

export function resolveArgs<X, A>(args: Args<X, A>): { [K in keyof A]: Rune<A[K], ArgsU<X>> }
export function resolveArgs(args: any): any {
  return args instanceof Array
    ? args.map(Rune.resolve)
    : Object.fromEntries(Object.entries(args).map(([k, v]) => [k, Rune.resolve(v)]))
}
