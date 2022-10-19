import * as $ from "../../deps/scale.ts";
import * as Z from "../../deps/zones.ts";
import * as U from "../../util/mod.ts";

export function decoded<
  Codec extends Z.$<$.Codec<unknown>>,
  Encoded extends Z.$<U.HexString>,
  Key extends Z.$<string>,
>(
  codec: Codec,
  encoded: Encoded,
  key: Key,
) {
  return Z.call(
    Z.ls(codec, encoded, key),
    // TODO: create `Wrap` util –– this is currently necessary as the decoded value is `unknown`,
    // which––left top-level––unifies with error types.
    ([codec, encoded, key]): Record<Z.T<Key>, any> => {
      return { [key]: codec.decode(U.hex.decode(encoded)) } as any;
    },
  );
}
