import * as $ from "../deps/scale.ts";
import * as Z from "../deps/zones.ts";

const k0_ = Symbol();
const k1_ = Symbol();

export function scaleDecoded<
  Codec extends Z.$<$.Codec<unknown>>,
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
      return { [key]: codec.decode(encoded) } as any;
    }, k0_)
    .zoned("ScaleDecoded");
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
        $.assert(codec, decoded);
      } catch (e) {
        return e as $.ScaleAssertError;
      }
      return codec[isAsync ? "encodeAsync" : "encode"](decoded);
    }, k1_);
}
