import { E_, Effect, Resolved } from "./Effect.ts";
import { RunContext } from "./Run.ts";

export function atom<N extends string, A extends unknown[], R>(
  fqn: N,
  args: [...A],
  impl: Impl<A, R>,
  exit?: Exit<R>,
): Atom<N, A, R> {
  return new Atom(fqn, args, impl, exit);
}

export class Atom<N extends string, A extends unknown[], R>
  extends Effect<N, Exclude<R, Error>, Extract<R, Error> | E_<A[number]>>
{
  constructor(
    fqn: N,
    readonly args: A,
    readonly impl: Impl<A, R>,
    readonly exit?: Exit<R>,
  ) {
    super(fqn);
  }
}

export type AnyAtom = Atom<string, any[], any>;

export type Impl<A extends unknown[], R> = (
  this: RunContext,
  ...args: Resolved<A>
) => R | Promise<R>;

// TODO: type the possibility of exit errors
export type Exit<R> = (resolved: Exclude<R, Error>) => void | Promise<void>;
