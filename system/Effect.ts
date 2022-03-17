import { UnionToIntersection, ValueOf } from "/_/util/types.ts";
import { Context } from "/system/Context.ts";
import { Sha256 } from "std/hash/sha256.ts";

/** Requirements */
export const _R: unique symbol = Symbol();
export type _R = typeof _R;

/** Error */
export const _E: unique symbol = Symbol();
export type _E = typeof _E;

/** Ok */
export const _A: unique symbol = Symbol();
export type _A = typeof _A;

/** Compatibility */
export const _C: unique symbol = Symbol();
export type _C = typeof _C;

/**
 * For now, use of `EffectFlags` is limited. In the future, this will serve as a means of signaling different
 * potential for optimizing effect execution.
 */
export enum EffectFlags {
  None = 0,
  Idempotent = 1,
}

/**
 * The `Effect` type is at the heart of the Capi DX. It is the means by which we model and compose computation.
 * Loosely based on Zio's concept of a `ZIO`, effects describe properties such as...
 *
 * - Compatibility (via the `C` phantom)
 * - Runtime requirements / dependency injection
 * - Any errors produced (either by its own computation or that of its dependencies)
 * - The ok / successful result type
 * - The set of dependencies / effects that need to be run prior
 *
 * @see https://zio.dev/version-1.x/datatypes/core/zio
 */
export class Effect<
  R,
  E extends Error,
  A,
  D extends AnyDeps,
  C,
> {
  [_R]!: R & UnionToIntersection<ValueOf<D>[_R]>;
  [_E]!: E | ValueOf<D>[_E];
  [_A]!: A;
  [_C]!: C;

  /**
   * @param tag This is used for stack traces, constant folding and serialization
   * @param deps A record of Effects, which need to be resolved in order to proceed
   * @param run A callback, which––at runtime––receives the requirements and resolved dependencies.
   * @param flags metadata, such as whether a given effect can be folded into those structurally identical
   */
  constructor(
    readonly tag: string,
    readonly deps: D,
    readonly run: (
      runtime: R,
      deps: Resolved<D>,
      context: Context,
    ) => Promise<Result<E, A>>,
    readonly flags: number,
  ) {}

  toString(): string {
    const depValues = Object.values(this.deps);
    if (depValues.length > 0) {
      return `${this.tag}(${depValues.map((e) => e.toString()).join(",")})`;
    }
    return this.tag;
  }

  get hash(): string { // ... but why? Assessing whether an effect has a given dep without descending the tree?
    return new TextDecoder().decode(
      new Uint8Array([
        ...new Sha256(false, true)
          .update(this.toString())
          .digest(),
      ]),
    );
  }
}

export const effect = <
  A,
  R = {},
  C = any,
>() => {
  return <
    E extends Error,
    D extends AnyDeps,
  >(
    tag: string,
    deps: D,
    run: (
      runtime: R,
      deps: Resolved<D>,
      context: Context,
    ) => Promise<Result<E, A>>,
    flags: number = EffectFlags.None,
  ): Effect<R, E, A, D, C> => {
    return new Effect(tag, deps, run, flags);
  };
};

/**
 * The following types are useful for constraining parameters. The individual slots are typed as `any` as to spare
 * the checker from recursing (which would result in circularity errors stemming from `Effect[_R]` and `Effect[_E]`).
 */
export type AnyEffect = Effect<any, any, any, any, any>;
export type AnyEffectA<A> = Effect<any, any, A, any, any>;

export const lift = <A>(a: A) => {
  return effect<A>()("Lift", {}, async () => {
    return ok(a);
  });
};

// TODO: do we even want this
// TODO: do error types flow through?
export const use = <
  Source extends AnyEffect,
  E extends Error,
  R,
>(
  source: Source,
  use: (resolved: Source[_A]) => Result<E, R>,
) => {
  return effect<R>()(
    "Use",
    { source },
    async (_, resolved) => {
      return use(resolved.source);
    },
  );
};

export const accessor = <Source extends AnyEffect>(source: Source) => {
  return <A>(select: (source: Source[_A]) => A) => {
    return effect<A>()("Accessor", { source }, async (_, resolved) => {
      return ok(select(resolved.source));
    });
  };
};

export type AnyDeps = Record<PropertyKey, Effect<any, any, any, any, any>>;

export type Resolved<D extends AnyDeps> = { [K in keyof D]: D[K][_A] };

export const ErrorCtor = <Name extends string>(name: Name) => {
  return class extends Error {
    readonly name: Name = name;
  };
};

export class Ok<A> {
  constructor(readonly value: A) {}
}
export const ok = <A>(value: A): Ok<A> => {
  return new Ok(value);
};

export type Result<
  E extends Error,
  A,
> = E | Ok<A>;
