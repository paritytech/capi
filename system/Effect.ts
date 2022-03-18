import * as u from "/_/util/mod.ts";
import { Context } from "/system/Context.ts";
import { Sha256 } from "std/hash/sha256.ts";
import { AnyResult, Ok, ok, Result } from "./Result.ts";

/** Requirements */
export const _R: unique symbol = Symbol();
export type _R = typeof _R;

/** Error */
export const _E: unique symbol = Symbol();
export type _E = typeof _E;

/** Ok */
export const _A: unique symbol = Symbol();
export type _A = typeof _A;

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
 * - Runtime requirements / dependency injection
 * - Any errors produced (either by its own computation or that of its dependencies)
 * - The ok / successful result type
 * - The set of dependencies / effects that need to be run prior
 *
 * @see https://zio.dev/version-1.x/datatypes/core/zio
 */
export class Effect<
  R extends Record<PropertyKey, any>,
  EA extends AnyResult,
  D extends AnyDeps,
> {
  [_R]!: R & u.UnionToIntersection<u.ValueOf<D>[_R]>;
  [_E]!: Extract<EA, Error> | WideErrorAsNever<u.ValueOf<D>[_E]>;
  [_A]!: Extract<EA, Ok<any>>["value"];

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
    ) => Promise<EA>,
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
  R extends Record<PropertyKey, any> = {},
>() => {
  return <
    EA extends Result<Error, A>,
    D extends AnyDeps,
  >(
    tag: string,
    deps: D,
    run: (
      runtime: R,
      deps: Resolved<D>,
      context: Context,
    ) => Promise<EA>,
    flags: number = EffectFlags.None,
  ): Effect<R, EA, D> => {
    return new Effect(tag, deps, run, flags);
  };
};

/**
 * The following types are useful for constraining parameters. The individual slots are typed as `any` as to spare
 * the checker from recursing (which would result in circularity errors stemming from `Effect[_R]` and `Effect[_E]`).
 */
export type AnyEffect = Effect<any, any, any>;
export type AnyEffectA<A> = Effect<any, Result<any, A>, any>;

export type AnyDeps = Record<PropertyKey, AnyEffect>;
export type Resolved<D extends AnyDeps> = { [K in keyof D]: D[K][_A] };
export type WideErrorAsNever<E> = [Error] extends [E] ? never : E;

export const lift = <A>(a: A): Effect<{}, Result<never, A>, {}> => {
  return effect<A>()("Lift", {}, async () => {
    return ok(a);
  });
};

export const accessor = <Source extends AnyEffect>(source: Source) => {
  return <A>(select: (source: Source[_A]) => A) => {
    return effect<A>()("Accessor", { source }, async (_, resolved) => {
      return ok(select(resolved.source));
    });
  };
};
