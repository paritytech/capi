import * as Z from "../../deps/zones.ts";
import * as M from "../../frame_metadata/mod.ts";

export const $extrinsic = Z.call.fac((
  deriveCodec: M.DeriveCodec,
  metadata: M.Metadata,
  sign: M.SignExtrinsic,
  prefix?: number,
) => {
  return M.$extrinsic({
    deriveCodec,
    metadata,
    sign: sign!,
    prefix: prefix!,
  });
});
