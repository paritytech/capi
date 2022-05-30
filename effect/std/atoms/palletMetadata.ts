import { effector } from "/effect/Effect.ts";
import * as m from "/frame_metadata/mod.ts";

export const palletMetadata = effector.sync(
  "palletMetadata",
  () =>
    (lookup: m.Lookup, palletName: string) => {
      return lookup.getPalletByName(palletName);
    },
);
