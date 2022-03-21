import * as u from "/_/util/mod.ts";
import { Metadata } from "/frame/Metadata.ts";
import { MetadataContainer } from "/frame_metadata/Container.ts";
import * as s from "/system/mod.ts";

export interface ChainResolved<Beacon> {
  resource: s.ResourceResolved<Beacon>;
  metadata: MetadataContainer;
}

export namespace Chain {
  export const ProxyWebSocketUrl = <Beacon extends s.AnyEffectA<string>>(beacon: Beacon) => {
    const resource = s.Resource.ProxyWebSocketUrl(beacon);
    const metadata = Metadata(resource);
    return s.effect<ChainResolved<Beacon[s._A]>>()(
      "FrameChain",
      { resource, metadata },
      async (_, resolved) => {
        return u.ok({
          resource: resolved.resource,
          metadata: resolved.metadata,
        });
      },
    );
  };
}
