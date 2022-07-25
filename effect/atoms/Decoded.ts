import * as $ from "../../deps/scale.ts";
import * as U from "../../util/mod.ts";
import { atom } from "../sys/Atom.ts";
import { T_, Val } from "../sys/Effect.ts";

export function decoded<
  Codec extends Val<$.Codec<unknown>>,
  Encoded extends Val<U.HexString>,
  Key extends Val<string>,
>(
  codec: Codec,
  encoded: Encoded,
  key: Key,
) {
  return atom(
    "Decoded",
    [codec, encoded, key],
    // TODO: create `Wrap` util –– this is currently necessary as the decoded value is `unknown`,
    // which––left top-level––unifies with error types.
    (codec, encoded, key): Record<T_<Key>, any> => {
      return { [key]: codec.decode(U.hex.decode(encoded)) } as any;
    },
  );
}
