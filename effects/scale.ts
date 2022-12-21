import * as $ from "../deps/scale.ts"
import * as Z from "../deps/zones.ts"
import * as M from "../frame_metadata/mod.ts"
import { DeriveCodec, Ty } from "../reflection/mod.ts"

const k0_ = Symbol()
const k1_ = Symbol()
const k2_ = Symbol()
const k3_ = Symbol()
const k4_ = Symbol()
const k5_ = Symbol()

export const deriveCodec = Z.call.fac((metadata: M.Metadata) => {
  return DeriveCodec(metadata.tys)
}, k0_)

export const codec = Z.call.fac((
  deriveCodec: DeriveCodec,
  ty: number | Ty,
) => {
  return deriveCodec(ty)
}, k1_)

export function scaleDecoded<
  Codec extends Z.$<$.Codec<any>>,
  Encoded extends Z.$<Uint8Array>,
  Key extends Z.$<PropertyKey>,
>(
  codec: Codec,
  encoded: Encoded,
  key: Key,
) {
  return Z
    .ls(codec, encoded, key)
    .next(([codec, encoded, key]): Record<Z.T<Key>, any> => {
      return { [key]: codec.decode(encoded) } as any
    }, k2_)
}

// TODO: eventually, utilize `V` to toggle runtime validation
export function scaleEncoded<Codec extends Z.$<$.Codec<any>>, Decoded>(
  codec: Codec,
  decoded: Decoded,
  isAsync?: boolean,
) {
  return Z
    .ls(codec, decoded, isAsync)
    .next(([codec, decoded]) => {
      try {
        $.assert(codec, decoded)
      } catch (e) {
        return e as $.ScaleAssertError
      }
      return codec[isAsync ? "encodeAsync" : "encode"](decoded)
    }, k3_)
}

export const $extrinsic = Z.call.fac((
  deriveCodec: DeriveCodec,
  metadata: M.Metadata,
  sign: M.Signer,
  prefix?: number,
) => {
  return M.$extrinsic({
    deriveCodec,
    metadata,
    sign: sign!,
    prefix: prefix!,
  })
}, k4_)

export const $storageKey = Z.call.fac((
  deriveCodec: DeriveCodec,
  pallet: M.Pallet,
  storageEntry: M.StorageEntry,
) => {
  return M.$storageKey({
    deriveCodec,
    pallet,
    storageEntry,
  })
}, k5_)
