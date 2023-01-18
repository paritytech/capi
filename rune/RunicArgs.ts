import { Rune } from "./Rune.ts"
import { ValueRune } from "./ValueRune.ts"

export type RunicArgs<X, A> =
  | (never extends X ? never : X extends A ? X : never)
  | { [K in keyof A]: A[K] | Rune<A[K], RunicArgs.U<X>> }

export namespace RunicArgs {
  export type U<X> = X extends unknown[] ? Rune.U<X[number]> : Rune.U<X[keyof X]>
  export function resolve<X, A>(
    args: RunicArgs<X, A>,
  ): { [K in keyof A]: ValueRune<A[K], RunicArgs.U<X>> }
  export function resolve(args: any): any {
    return args instanceof Array
      ? args.map(Rune.resolve)
      : Object.fromEntries(Object.entries(args).map(([k, v]) => [k, Rune.resolve(v)]))
  }
}
