import * as M from "../../frame_metadata/mod.ts";
import { Hashers } from "../../hashers/mod.ts";
import { atomFactory } from "../sys/Atom.ts";

// TODO: remove this upon enabling async codecs / utilizing async sign in extrinsic codec
export const $extrinsicEncodeAsync = atomFactory("ExtrinsicEncodeAsync", async (
  deriveCodec: M.DeriveCodec,
  metadata: M.Metadata,
  sign?: M.SignExtrinsic,
) => {
  return M.$encodeAsync({
    deriveCodec,
    hashers: await Hashers(),
    metadata,
    sign: sign!,
  });
});
