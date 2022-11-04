import * as fs from "../deps/std/fs.ts";
import * as path from "../deps/std/path.ts";
import { acala, kusama, moonbeam, polkadot, statemint, subsocial, westend } from "../known/mod.ts";
import * as C from "../mod.ts";
import * as U from "../util/mod.ts";

const outDir = path.join(Deno.cwd(), "frame_metadata", "_downloaded");
await fs.emptyDir(outDir);
await Promise.all(
  Object.entries({ acala, kusama, moonbeam, polkadot, statemint, subsocial, westend }).map(
    async ([name, client]) => {
      try {
        const metadataHex = U.throwIfError(await C.state.getMetadata(client)().run());
        const outPath = path.join(outDir, `${name}.scale`);
        console.log(`Downloading ${name} metadata to "${outPath}".`);
        await Deno.writeTextFile(outPath, metadataHex);
      } catch (e) {
        console.error(`Encountered error downloading frame metadata for ${name}.`);
        console.error(e);
        Deno.exit(1);
      }
    },
  ),
);
