import * as Z from "/effect/Effect.ts";

export class NonIdempotent<Root> extends Z.Effect<Z.UnwrapR<Root>, Z.UnwrapE<Root>, Z.UnwrapA<Root>> {
  constructor(readonly root: Root) {
    super();
  }

  signature(): string {
    return `${this.constructor.name}(${Z.Effect.state.idOf(this.root)})`;
  }
}

export type AnyNonIdempotent<A = any> = NonIdempotent<Z.MaybeEffectLike<A>>;

export const nonIdempotent = <Root>(root: Root): NonIdempotent<Root> => {
  return new NonIdempotent(root);
};
