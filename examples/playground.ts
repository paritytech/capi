import { POLKADOT_RPC_URL } from "/_/constants/chains/url.ts";
import * as c from "/effect/mod.ts";
import { wsRpcClient } from "/rpc/mod.ts";
import { hashersRuntime } from "/runtime/Hashers.ts";
import * as crypto from "/target/wasm/crypto/mod.js";
import * as hex from "std/encoding/hex.ts";

const system = c.pallet(POLKADOT_RPC_URL, "System");
const accountId32 = c.native(["13SceNt2ELz3ti4rnQbY1snpYH4XE4fLFsW8ph9rpwJd6HFC"], (init) => {
  return async () => {
    return { 0: [...hex.decode(crypto.decodeSs58(init))] };
  };
});
const entry = system.entry("Account", accountId32).read();
const resolved = await c.runtime(entry).run({
  rpcClientFactory: wsRpcClient,
  ...hashersRuntime,
});
console.log(resolved);
