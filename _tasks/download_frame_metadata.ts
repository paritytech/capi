import * as asserts from "../_deps/asserts.ts";
import * as fs from "../_deps/fs.ts";
import * as path from "../_deps/path.ts";
import { CHAIN_URL_LOOKUP } from "../constants/chains/url.ts";
import * as rpc from "../rpc/mod.ts";

const outDir = path.join(Deno.cwd(), "frame_metadata", "_downloaded");
await fs.emptyDir(outDir);
await Promise.all(
  CHAIN_URL_LOOKUP.map(async ([name, url]) => {
    const client = await rpc.wsRpcClient(url);
    try {
      const metadata = await client.call("state_getMetadata", []);
      asserts.assert(metadata.result);
      const outPath = path.join(outDir, `${name}.scale`);
      console.log(`Downloading ${name} metadata to "${outPath}".`);
      await Deno.writeTextFile(outPath, metadata.result);
    } catch (e) {
      console.error(`Encountered error downloading frame metadata for ${name}.`);
      console.error(e);
      Deno.exit(1);
    }
    await client.close();
  }),
);
