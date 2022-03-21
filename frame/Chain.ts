import { Metadata } from "/frame/Metadata.ts";
import { MetadataContainer } from "/frame_metadata/Container.ts";
import * as sys from "/system/mod.ts";

export interface ChainResolved<Beacon> {
  resource: sys.ResourceResolved<Beacon>;
  metadata: MetadataContainer;
}

export namespace Chain {
  export const ProxyWebSocketUrl = <Beacon extends sys.AnyEffectA<string>>(beacon: Beacon) => {
    const resource = sys.Resource.ProxyWebSocketUrl(beacon);
    const metadata = Metadata(resource);
    return sys.effect<ChainResolved<Beacon[sys._A]>>()(
      "FrameChain",
      { resource, metadata },
      async (_, resolved) => {
        return sys.ok({
          resource: resolved.resource,
          metadata: resolved.metadata,
        });
      },
    );
  };
}
