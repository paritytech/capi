import { MaybeEffectLike } from "/effect/Effect.ts";
import { step } from "/effect/intrinsic/Step.ts";

export const wrap = <
  T,
  K extends MaybeEffectLike<PropertyKey>,
>(
  target: T,
  key: K,
) => {
  return step(
    "Wrap",
    [target, key],
    (target, key) => {
      return async () => {
        return { [key]: target };
      };
    },
  );
};
