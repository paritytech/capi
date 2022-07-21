import * as M from "../../frame_metadata/mod.ts";
import { Hashers } from "../../hashers/mod.ts";
import { atom } from "../sys/Atom.ts";
import { Val } from "../sys/Effect.ts";

export function extrinsicCodec<
  DeriveCodec extends Val<M.DeriveCodec>,
  Metadata extends Val<M.Metadata>,
  Rest extends [sign?: Val<M.SignExtrinsic>],
>(
  deriveCodec: DeriveCodec,
  metadata: Metadata,
  ...[sign]: Rest
) {
  return atom(
    "KeyCodec",
    [deriveCodec, metadata, sign],
    async (deriveCodec, metadata, sign) => {
      return M.$extrinsic({
        deriveCodec,
        hashers: await Hashers(),
        metadata,
        sign: sign!,
      });
    },
  );
}
