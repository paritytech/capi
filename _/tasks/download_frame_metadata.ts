import { CHAIN_URL_LOOKUP } from "/_/constants/chains/url.ts";
import * as rpc from "/rpc/mod.ts";
import * as fs from "std/fs/mod.ts";
import * as path from "std/path/mod.ts";

const outDir = path.join(Deno.cwd(), "target", "frame_metadata");
await fs.emptyDir(outDir);
await Promise.all(
  CHAIN_URL_LOOKUP.map(async ([name, url]) => {
    const client = await rpc.wsRpcClient(url);
    try {
      const metadata = await rpc.call(client, "state_getMetadata", []);
      if (rpc.isErrRes(metadata)) {
        console.log(metadata);
        throw new Error();
      }
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
