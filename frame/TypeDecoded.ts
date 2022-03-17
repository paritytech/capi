import { MetadataContainer } from "/frame_metadata/Container.ts";
import { FrameTypeDecoder } from "/frame_metadata/TypeDecoder.ts";
import * as d from "/scale/decode.ts";
import * as sys from "/system/mod.ts";
import * as hex from "std/encoding/hex.ts";

export const TypeDecoded = <
  Metadata extends sys.AnyEffectA<MetadataContainer>,
  Index extends sys.AnyEffectA<number>,
  Encoded extends sys.AnyEffectA<string>,
>(
  metadata: Metadata,
  index: Index,
  encoded: Encoded,
) => {
  return sys.effect<unknown>()(
    "TypeDecoded",
    { metadata, index, encoded },
    async (_, resolved) => {
      return sys.ok(d.run(
        FrameTypeDecoder(resolved.metadata, resolved.index),
        hex.decode(new TextEncoder().encode(resolved.encoded.substring(2))),
      ));
    },
  );
};
