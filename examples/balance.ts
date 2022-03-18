#!/usr/bin/env -S deno run -A --no-check=remote --import-map=import_map.json

import { POLKADOT_RPC_URL } from "/_/constants/chains/url.ts";
import * as frame from "/frame/mod.ts";
import * as sys from "/system/mod.ts";
import * as crypto from "/target/wasm/crypto/mod.js";
import * as hex from "std/encoding/hex.ts";

const POLKASSEMBLY_ADDR = "13SceNt2ELz3ti4rnQbY1snpYH4XE4fLFsW8ph9rpwJd6HFC" as const;
const polkassemblyPubKey = crypto.decodeSs58(POLKASSEMBLY_ADDR);
export const pubKeyBytes = hex.decode(polkassemblyPubKey);

// Bind to a specific chain via a proxy URL
const chain = frame.Chain.ProxyWebSocketUrl(sys.lift(POLKADOT_RPC_URL));

// Bind to a specific storage entry of the chain
const storageEntry = frame.StorageEntry(chain, "System", "Account");

// Bind to a value of the storage entry
const storageMapValue = frame.StorageMapValue(storageEntry, sys.lift(pubKeyBytes));

// Initiate the request
const result = await sys.Fiber(storageMapValue, new sys.WebSocketConnections(), {});

if (result instanceof Error) {
  console.log(result);
} else {
  console.log(result.value);
}
