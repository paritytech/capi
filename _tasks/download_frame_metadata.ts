import { emptyDir, pathJoin } from "../barrel.ts";
import { CHAIN_URL_LOOKUP } from "../constants/chains/url.ts";
import * as rpc from "../rpc/mod.ts";

const outDir = pathJoin(Deno.cwd(), "target", "frame_metadata");
await emptyDir(outDir);
await Promise.all(
  CHAIN_URL_LOOKUP.map(async ([name, url]) => {
    const client = await rpc.wsRpcClient(url);
    try {
      const metadata = await rpc.call(client, "state_getMetadata", []);
      if (rpc.isErrRes(metadata)) {
        console.log(metadata);
        throw new Error();
      }
      const outPath = pathJoin(outDir, `${name}.scale`);
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
