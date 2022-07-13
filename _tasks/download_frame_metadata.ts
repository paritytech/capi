import { assert } from "../_deps/asserts.ts";
import * as fs from "../_deps/fs.ts";
import * as path from "../_deps/path.ts";
import { acala, kusama, moonbeam, polkadot, statemint, subsocial, westend } from "../known/mod.ts";
import * as rpc from "../rpc/mod.ts";

const outDir = path.join(Deno.cwd(), "frame_metadata", "_downloaded");
await fs.emptyDir(outDir);
await Promise.all(
  Object.entries({ acala, kusama, moonbeam, polkadot, statemint, subsocial, westend }).map(
    async ([name, config]) => {
      const client = await rpc.fromConfig(config);
      assert(!(client instanceof Error));
      try {
        const metadata = await client.call("state_getMetadata", []);
        assert(metadata.result);
        const outPath = path.join(outDir, `${name}.scale`);
        console.log(`Downloading ${name} metadata to "${outPath}".`);
        await Deno.writeTextFile(outPath, metadata.result);
      } catch (e) {
        console.error(`Encountered error downloading frame metadata for ${name}.`);
        console.error(e);
        Deno.exit(1);
      }
      await client.close();
    },
  ),
);
