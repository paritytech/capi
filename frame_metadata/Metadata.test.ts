import * as path from "https://deno.land/std@0.136.0/path/mod.ts";
import { assertSnapshot } from "https://deno.land/std@0.136.0/testing/snapshot.ts";
import * as M from "./Metadata.ts";

await Promise.all(
  [
    "polkadot",
    "kusama",
    "statemint",
    "moonbeam",
    "acala",
    "subsocial",
  ].map(async (name) => {
    Deno.test(name, async (t) => {
      const scaleEncoded = await Deno.readTextFile(path.join("target/frame_metadata/", `${name}.scale`));
      const decodedMetadata = M.fromPrefixedHex(scaleEncoded);
      await assertSnapshot(t, decodedMetadata);
    });
  }),
);
