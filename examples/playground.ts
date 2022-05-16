import { POLKADOT_RPC_URL } from "/_/constants/chains/url.ts";
import * as c from "/effect/mod.ts";
import { wsRpcClient } from "/rpc/mod.ts";
import { hashers } from "/runtime/Hashers.ts";

const ss58 = c.ss58FromText("13SceNt2ELz3ti4rnQbY1snpYH4XE4fLFsW8ph9rpwJd6HFC");
const pubKey = c.pubKeyFromSs58(ss58);
const accountId32 = c.accountId32FromPubKey(pubKey);
const entry = c
  .pallet(POLKADOT_RPC_URL, "System")
  .entry("Account", accountId32)
  .read();
const run = c.runtime({
  rpc: wsRpcClient,
  hashers,
});
const result = await run(entry);
console.log(result);
