import { effector } from "/effect/mod.ts";
import * as M from "/frame_metadata/mod.ts";

export const palletMetadata = effector.sync(
  "palletMetadata",
  () =>
    (lookup: M.Lookup, palletName: string) => {
      return lookup.getPalletByName(palletName);
    },
);
