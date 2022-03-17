#!/usr/bin/env -S deno run -A --no-check=remote --import-map=import_map.json

import * as chainUris from "/_/constants/chains/url.ts";
import * as hex from "std/encoding/hex.ts";
import * as fs from "std/fs/mod.ts";
import * as path from "std/path/mod.ts";

const outDir = path.join(Deno.cwd(), "target", "frame_metadata");
await fs.emptyDir(outDir);

// TODO: do we want to use the `GetMetadata` effect instead? Eventually, yes.
await Promise.all(
  ([
    ["polkadot", chainUris.POLKADOT_RPC_URL],
    ["kusama", chainUris.KUSAMA_RPC_URL],
    ["statemint", chainUris.STATEMINT_RPC_URL],
    ["moonbeam", chainUris.MOONBEAM_RPC_URL],
    ["acala", chainUris.ACALA_RPC_URL],
    ["subsocial", chainUris.SUBSOCIAL_RPC_URL],
  ] as const).map(([name, uri]) => {
    return new Promise<void>((resolve) => {
      const ws = new WebSocket(uri);

      ws.onerror = (e) => {
        console.error(`Encountered error downloading frame metadata for ${name}.`);
        console.error(e);
        Deno.exit(1);
      };

      ws.onmessage = async (e) => {
        const outPath = path.join(outDir, `${name}.scale`);
        console.log(`Downloading ${name} metadata to "${outPath}".`);
        await Deno.writeFile(outPath, hex.decode(new TextEncoder().encode(JSON.parse(e.data).result.substring(2))));
        ws.close();
        resolve();
      };

      ws.onopen = () => {
        ws.send(JSON.stringify({
          id: 1,
          jsonrpc: "2.0",
          method: "state_getMetadata",
          params: [],
        }));
      };
    });
  }),
);
