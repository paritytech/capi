import * as u from "/_/util/mod.ts";
import { MetadataContainer } from "/frame_metadata/Container.ts";
import { FrameTypeDecoder } from "/frame_metadata/TypeDecoder.ts";
import * as d from "/scale/decode.ts";
import * as s from "/system/mod.ts";
import * as hex from "std/encoding/hex.ts";

export const TypeDecoded = <
  Metadata extends s.AnyEffectA<MetadataContainer>,
  Index extends s.AnyEffectA<number>,
  Encoded extends s.AnyEffectA<string>,
>(
  metadata: Metadata,
  index: Index,
  encoded: Encoded,
) => {
  return s.effect<unknown>()(
    "TypeDecoded",
    { metadata, index, encoded },
    async (_, resolved) => {
      return u.ok(d.run(
        new FrameTypeDecoder(resolved.metadata, resolved.index).digest(),
        hex.decode(new TextEncoder().encode(resolved.encoded.substring(2))),
      ));
    },
  );
};
