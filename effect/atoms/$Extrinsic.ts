import * as M from "../../frame_metadata/mod.ts";
import { Hashers } from "../../hashers/mod.ts";
import { atomFactory } from "../sys/Atom.ts";

export const $extrinsic = atomFactory("ExtrinsicCodec", async (
  deriveCodec: M.DeriveCodec,
  metadata: M.Metadata,
  sign?: M.SignExtrinsic,
) => {
  return M.$extrinsic({
    deriveCodec,
    hashers: await Hashers(),
    metadata,
    sign: sign!,
  });
});
