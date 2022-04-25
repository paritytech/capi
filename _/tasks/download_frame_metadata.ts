import { CHAIN_URL_LOOKUP } from "/_/constants/chains/url.ts";
import { WsConnections } from "/connections/ws/mod.ts";
import * as fs from "std/fs/mod.ts";
import * as path from "std/path/mod.ts";
import * as asserts from "std/testing/asserts.ts";

const outDir = path.join(Deno.cwd(), "target", "frame_metadata");
await fs.emptyDir(outDir);
const connections = new WsConnections();
await Promise.all(
  CHAIN_URL_LOOKUP.map(async ([name, url]) => {
    const connection = connections.use(url);
    const id = connection.definePayload({
      method: "state_getMetadata",
      params: [],
    });
    try {
      const metadataPending = connection.receive(id);
      await connection.sendPayload(id);
      const metadata = await metadataPending;
      asserts.assert(typeof metadata === "string");
      const outPath = path.join(outDir, `${name}.scale`);
      console.log(`Downloading ${name} metadata to "${outPath}".`);
      await Deno.writeTextFile(outPath, metadata);
    } catch (e) {
      console.error(`Encountered error downloading frame metadata for ${name}.`);
      console.error(e);
      Deno.exit(1);
    }
    await connection.close();
  }),
);
