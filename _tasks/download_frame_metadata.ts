import * as asserts from "../_deps/asserts.ts";
import * as fs from "../_deps/fs.ts";
import * as path from "../_deps/path.ts";
import * as known from "../known/mod.ts";
import * as rpc from "../rpc/mod.ts";

const outDir = path.join(Deno.cwd(), "frame_metadata", "_downloaded");
await fs.emptyDir(outDir);
await Promise.all(
  Object.entries({
    acala: known.ACALA_PROXY_WS_URL,
    kusama: known.KUSAMA_PROXY_WS_URL,
    moonbeam: known.MOONBEAM_PROXY_WS_URL,
    polkadot: known.POLKADOT_PROXY_WS_URL,
    statemint: known.STATEMINT_PROXY_WS_URL,
    subsocial: known.SUBSOCIAL_PROXY_WS_URL,
    westend: known.WESTEND_PROXY_WS_URL,
  }).map(async ([name, url]) => {
    const client = await rpc.rpcClient(url);
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
