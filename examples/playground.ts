import { MOONBEAM_RPC_URL } from "/_/constants/chains/url.ts";
import * as c from "/effect/mod.ts";
import { wsRpcClient } from "/rpc/mod.ts";
import { hashersRuntime } from "/runtime/Hashers.ts";

const system = c.pallet(MOONBEAM_RPC_URL, "System");
const pubKey = c.pubKeyFromSs58Text("13SceNt2ELz3ti4rnQbY1snpYH4XE4fLFsW8ph9rpwJd6HFC");
const read = system.entry("Account", pubKey).read();

const result = await c.runtime(read).run({
  rpcClientFactory: wsRpcClient,
  ...hashersRuntime,
});

console.log(result);

// console.log(read.root);
