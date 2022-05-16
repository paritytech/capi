import * as Z from "/effect/Effect.ts";

export class NonIdempotent<Root> extends Z.Effect<Z.UnwrapR<Root>, Z.UnwrapE<Root>, Z.UnwrapA<Root>> {
  constructor(readonly root: Root) {
    super();
  }
}

export type AnyNonIdempotent<A = any> = NonIdempotent<Z.MaybeEffectLike<A>>;

export function nonIdempotent<Root>(root: Root): NonIdempotent<Root> {
  return new NonIdempotent(root);
}
