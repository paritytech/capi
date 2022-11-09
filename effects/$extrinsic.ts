import * as Z from "../deps/zones.ts";
import * as M from "../frame_metadata/mod.ts";

const k0_ = Symbol();

export const $extrinsic = Z.call.fac((
  deriveCodec: M.DeriveCodec,
  metadata: M.Metadata,
  sign: M.Signer,
  prefix?: number,
) => {
  return M.$extrinsic({
    deriveCodec,
    metadata,
    sign: sign!,
    prefix: prefix!,
  });
}, k0_);
