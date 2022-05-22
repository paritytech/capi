import { POLKADOT_RPC_URL } from "/constants/chains/url.ts";
import * as C from "/effect/mod.ts";

import { hashers } from "/env/mod.ts";
import { wsRpcClient } from "/rpc/mod.ts";

const ss58 = C.ss58FromText("13SceNt2ELz3ti4rnQbY1snpYH4XE4fLFsW8ph9rpwJd6HFC");
const pubKey = C.pubKeyFromSs58(ss58);
const accountId32 = C.accountId32FromPubKey(pubKey);
const entry = C
  .pallet(POLKADOT_RPC_URL, "System")
  .entry("Account", accountId32)
  .read();

const run = C.runtime({
  rpc: wsRpcClient,
  hashers,
});

const result = await run(entry);
console.log({ result });
