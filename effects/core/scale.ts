import * as $ from "../../deps/scale.ts";
import * as Z from "../../deps/zones.ts";

export function decoded<
  Codec extends Z.$<$.Codec<unknown>>,
  Encoded extends Z.$<Uint8Array>,
  Key extends Z.$<PropertyKey>,
>(
  codec: Codec,
  encoded: Encoded,
  key: Key,
) {
  return Z.ls(codec, encoded, key).next(
    function decodedImpl([codec, encoded, key]): Record<Z.T<Key>, any> {
      return { [key]: codec.decode(encoded) } as any;
    },
  );
}

// TODO: eventually, utilize `V` to toggle runtime validation
export function encoded<Codec extends Z.$<$.Codec<any>>, Decoded>(
  codec: Codec,
  decoded: Decoded,
  isAsync?: boolean,
) {
  return Z.ls(codec, decoded, isAsync).next(function encodedImpl([codec, decoded]) {
    try {
      $.assert(codec, decoded);
    } catch (e) {
      return e as $.ScaleAssertError;
    }
    return codec[isAsync ? "encodeAsync" : "encode"](decoded);
  });
}
