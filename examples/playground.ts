import { MOONBEAM_RPC_URL } from "/_/constants/chains/url.ts";
import * as c from "/effect/mod.ts";
import { wsRpcClient } from "/rpc/mod.ts";
import { hashersRuntime } from "/runtime/Hashers.ts";

const account = c
  .pallet(MOONBEAM_RPC_URL, "System")
  .entry("Account")
  .read();
const result = await c.runtime(account as any).run({
  rpcClientFactory: wsRpcClient,
  ...hashersRuntime,
});
console.log(result);
