import * as $ from "../../_deps/scale.ts";
import * as U from "../../util/mod.ts";
import { atom } from "../sys/Atom.ts";
import { Val } from "../sys/Effect.ts";

export type Decoded = ReturnType<typeof decoded>;
export function decoded<
  Codec extends Val<$.Codec<any>>,
  Encoded extends Val<U.HexString>,
>(
  codec: Codec,
  encoded: Encoded,
) {
  return atom(
    "Decoded",
    [codec, encoded],
    (codec, encoded) => {
      return codec.decode(U.hex.decode(encoded));
    },
  );
}
