import { _Node, _valueNode } from "./_Node.ts";
import {
  _ArrayE,
  _ArrayK,
  _EffectBase,
  _K,
  AsyncEffect,
  Effect,
  EffectKind,
  StreamEffect,
  SyncEffect,
} from "./Effect.ts";

type MaxEffectKind<K extends EffectKind> = EffectKind.Stream extends K ? EffectKind.Stream
  : EffectKind.Async extends K ? EffectKind.Async
  : EffectKind.Sync;

/** Like `_EffectBase`, but yields specific subtypes */
type EffectOfKind<K extends EffectKind, T, E extends Error> = [
  SyncEffect<T, E>,
  AsyncEffect<T, E>,
  StreamEffect<T, E>,
][K];

/** Like `EffectOfKind`, but supports inference */
type InferEffectOfKind<K extends EffectKind, T, E extends Error> = (
  never extends K // This always resolves to true
  ? // This is the real type
  EffectOfKind<K, T, E>
    : // This latter branch only affects type inference
    _EffectBase<K, T, E>
);

type EffectKindReturn<K extends EffectKind, R> = [
  R,
  Promise<R>,
  AsyncIterableIterator<R>,
][K];

type EffectorEffect<K extends EffectKind, T, E extends Error, X extends unknown[]> = EffectOfKind<
  MaxEffectKind<K | _ArrayK<X>>,
  T,
  E | _ArrayE<X>
>;

type EffectorArg<K extends EffectKind, T, E extends Error> = (
  // If `K` is `never`, all of the arguments are plain values
  [K] extends [never] ? T
    : [
      SyncEffect<T, E> | T,
      SyncEffect<T, E> | AsyncEffect<T, E> | T,
      SyncEffect<T, E> | AsyncEffect<T, E> | T, // `StreamEffect` is not supported here
    ][K]
);

export type EffectorArgs<X extends unknown[], A extends unknown[]> = (
  never extends X // This always resolves to true
  ? // This mapped type is the real type of the arguments
  { [K in keyof A]: EffectorArg<_ArrayK<X>, A[K], _ArrayE<X>> }
    : // This latter branch only affects type inference
    X extends A // Infer `X` based on a constraint of `A`
    ? 
      | X // Infer `X` based on all of the arguments to the function
      | { [K in keyof A]: A[K] | Effect<A[K], any> } // Infer generics within `A[K]` from arguments
    : never
);

/** Warning: values of this type should only be passed to other effectors, not used directly */
export type EffectorItem<T> = SyncEffect<T, never>;
export type EffectorItemCollection<C> = { [K in keyof C]: EffectorItem<C[K]> };

export function effector<
  K extends EffectKind,
  T,
  E extends Error,
  A extends unknown[],
>(
  _name: string,
  fn: (...args: EffectorItemCollection<A>) => InferEffectOfKind<K, T, E>,
) {
  return fn as any as <X extends unknown[]>(
    ...args: EffectorArgs<X, A>
  ) => EffectorEffect<K, T, E, X>;
}

effector.generic = <F>(
  _name: string,
  fn: (
    effect: <
      K extends EffectKind,
      T,
      E extends Error,
      X extends unknown[],
      A extends unknown[],
    >(
      args: EffectorArgs<X, A>,
      resolve: (
        ...args: EffectorItemCollection<A>
      ) => InferEffectOfKind<K, T, E>,
    ) => EffectorEffect<K, T, E, X>,
  ) => F,
): F => {
  return fn((args, fn) => fn(...args as never) as never);
};

export namespace effector {
  export const sync = _effectorAtomicFn(EffectKind.Sync);
  export const async = _effectorAtomicFn(EffectKind.Async);
  export const stream = _effectorAtomicFn(EffectKind.Stream);
}

function _effectorAtomicFn<K extends EffectKind>(baseKind: K) {
  function step<R, A extends unknown[]>(
    name: string,
    resolve: () => (...args: A) => EffectKindReturn<K, R>,
  ) {
    return {
      [name]: function<X extends unknown[]>(
        ...args: EffectorArgs<X, A>
      ): EffectorEffect<K, Exclude<R, Error>, Extract<R, Error>, X> {
        return _effectorAtomic(baseKind, name, args, resolve);
      },
    }[name]!;
  }

  step.generic = <F>(
    name: string,
    fn: (
      effect: <R, X extends unknown[], A extends unknown[]>(
        args: EffectorArgs<X, A>,
        resolve: () => (...args: A) => EffectKindReturn<K, R>,
      ) => EffectorEffect<K, Exclude<R, Error>, Extract<R, Error>, X>,
    ) => F,
  ): F => {
    return fn((args, resolve) => _effectorAtomic(baseKind, name, args, resolve));
  };

  return step;
}

function _effectorAtomic(
  baseKind: EffectKind,
  _name: string,
  args: any[],
  resolve: () => (...argsResolved: any) => any,
): any {
  const outKind: EffectKind = Math.max(
    baseKind,
    ...args.map((x) => x instanceof _EffectBase ? x[_K] : EffectKind.Sync),
  );
  const deps = args.map((x) => x instanceof _EffectBase ? x._node : _valueNode(x));
  if (outKind === EffectKind.Sync) {
    return new SyncEffect({
      kind: "syncFunc",
      fn: resolve(),
      deps,
      resolved: false,
      value: undefined,
    });
  }
  if (outKind === EffectKind.Async) {
    if (baseKind === EffectKind.Async) {
      return new AsyncEffect({
        kind: "asyncFunc",
        fn: resolve(),
        deps,
        resolved: false,
        value: undefined,
        running: false,
        promise: undefined,
      });
    } else {
      return new AsyncEffect({
        kind: "syncFunc",
        fn: resolve(),
        deps,
        resolved: false,
        value: undefined,
      });
    }
  }
  throw new Error("StreamEffects are currently unsupported");
}
