import { effector, EffectorArgs } from "/effect/mod.ts";

export const wrap = effector.sync.generic(
  "wrap",
  (effect) =>
    <T, K extends PropertyKey, X extends unknown[]>(
      ...args: EffectorArgs<X, [target: T, key: K]>
    ) => effect(args, () => (target, key) => ({ [key]: target })),
);
