import { effector, EffectorArgs } from "/effect/impl/mod.ts";
import * as hex from "/util/hex.ts";
import type * as $ from "x/scale/mod.ts";

// TODO: DecodedError from `frame_metadata`?

export const decoded = effector.sync.generic(
  "decoded",
  (effect) =>
    <T, X extends unknown[]>(...args: EffectorArgs<X, [codec: $.Codec<T>, encoded: string]>) =>
      effect(args, () =>
        (codec, encoded) => {
          return codec.decode(hex.decode(encoded));
        }),
);
