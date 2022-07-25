import { E_, Effect, Resolved, T_, ValCollection } from "./Effect.ts";
import { key } from "./key.ts";
import { RunContext } from "./run.ts";

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

export function atomFactory<N extends string, AR extends unknown[], R>(
  fqn: N,
  impl: (...args: AR) => R | Promise<R>,
  exit?: Exit<R>,
) {
  return <A extends ValCollection<AR>>(...args: A): Atom<N, A, R> => {
    return new Atom(fqn, args, impl as Impl<A, R>, exit);
  };
}

export type AnyAtom = Atom<string, any[], any>;

export type Impl<A extends unknown[], R> = (
  this: RunContext,
  ...args: Resolved<A>
) => R | Promise<R>;

// TODO: type the possibility of exit errors
export type Exit<R> = (resolved: Exclude<R, Error>) => void | Promise<void>;

// T6's magical wonderland type (slightly modified –– let's see if I broke it)
export type AtomArg<T, E extends Error> = [any] extends [never] ? T : Effect<string, T, E> | T;
export type AtomArgs<X extends unknown[], A extends unknown[]> =
  // This always resolves to true
  never extends X
    // This mapped type is the real type of the arguments
    ? { [K in keyof A]: AtomArg<A[K], E_<X[number]>> }
    // This latter branch only affects type inference
    : X extends A ? // Infer `X` based on a constraint of `A`
      | X // Infer `X` based on all of the arguments to the function
      | { [K in keyof A]: A[K] | Effect<string, A[K], any> } // Infer generics within `A[K]` from arguments
    : never;

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
