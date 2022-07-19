import * as M from "../../frame_metadata/mod.ts";
import { atom } from "../sys/Atom.ts";
import { Val } from "../sys/Effect.ts";

export type Codec = ReturnType<typeof codec>;
export function codec<
  DeriveCodec extends Val<M.DeriveCodec>,
  TypeI extends Val<number>,
>(
  deriveCodec: DeriveCodec,
  typeI: TypeI,
) {
  return atom(
    "Codec",
    [deriveCodec, typeI],
    (deriveCodec, typeI) => {
      return deriveCodec(typeI);
    },
  );
}
