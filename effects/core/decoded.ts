import * as $ from "../../deps/scale.ts";
import * as Z from "../../deps/zones.ts";

export function decoded<
  Codec extends Z.$<$.Codec<unknown>>,
  Encoded extends Z.$<Uint8Array>,
  Key extends Z.$<string>,
>(
  codec: Codec,
  encoded: Encoded,
  key: Key,
) {
  return Z.call(
    Z.ls(codec, encoded, key),
    function decodedImpl([codec, encoded, key]): Record<Z.T<Key>, any> {
      return { [key]: codec.decode(encoded) } as any;
    },
  );
}
