import { effector, EffectorArgs } from "../../impl/mod.ts";

export const select = effector.sync.generic(
  "select",
  (effect) =>
    <T, K extends keyof T, X extends unknown[]>(...args: EffectorArgs<X, [target: T, key: K]>) =>
      effect(args, () => (target, key): T[K] => target[key]),
);
