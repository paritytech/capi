import * as u from "/_/util/mod.ts";
import * as m from "/frame_metadata/mod.ts";
import * as rpc from "/rpc/mod.ts";
import * as sys from "/system/mod.ts";

const EXPECTED_PREFIX = "0x6d657461";
const EXPECTED_PREFIX_LEN = 10;

export const Metadata = <
  Beacon,
  Resource extends sys.AnyEffectA<sys.ResourceResolved<Beacon>>,
>(resource: Resource) => {
  const getMetadataResult = rpc.StateGetMetadata(resource);
  return sys.effect<m.MetadataContainer>()(
    "FrameMetadata",
    { getMetadataResult },
    async (_, resolved) => {
      if (resolved.getMetadataResult.substring(0, EXPECTED_PREFIX_LEN) !== EXPECTED_PREFIX) {
        return new MalformedResponseErr("Something");
      }
      try {
        return sys.ok(new m.MetadataContainer(resolved.getMetadataResult.substring(EXPECTED_PREFIX_LEN)));
      } catch (e) {
        // Decoding error.
        return new MalformedResponseErr();
      }
    },
  );
};

export class MalformedResponseErr extends u.ErrorCtor("MalformedResponse") {}
