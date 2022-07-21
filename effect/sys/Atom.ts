import { E_, Effect, Resolved, T_ } from "./Effect.ts";
import { key } from "./key.ts";
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

export function anon<A extends unknown[], R>(
  args: [...A],
  impl: Impl<A, R>,
  exit?: Exit<R>,
): Atom<string, A, R> {
  return new Atom(key(impl), args, impl, exit);
}

export function into<A extends unknown[], R extends AnyAtom | Error>(
  args: [...A],
  into: Impl<A, R>,
): Atom<string, A, Extract<R, Error> | E_<Extract<R, AnyAtom>> | T_<Extract<R, AnyAtom>>> {
  return new Atom("Map", args, async function(...args) {
    const next = await into.bind(this)(...args);
    if (next instanceof Error) {
      return next;
    }
    return await this.run(next);
  });
}

export function all<A extends unknown[]>(...effects: A): Atom<"All", A, Resolved<A>> {
  return new Atom("All", effects, (...resolved) => {
    return resolved;
  });
}
