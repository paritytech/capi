import { MaybeEffectLike, UnwrapA } from "/effect/Effect.ts";
import { step } from "/effect/intrinsic/Step.ts";

export const select = <
  T,
  K extends MaybeEffectLike<keyof UnwrapA<T>>,
>(
  target: T,
  key: K,
) => {
  return step(
    "Select",
    [target, key],
    (target, key) => {
      return async () => {
        return (target as any)[key];
      };
    },
  );
};
