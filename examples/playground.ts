import { POLKADOT_RPC_URL } from "/_/constants/chains/url.ts";
import * as C from "/effect/mod.ts";
import { wsRpcClient } from "/rpc/mod.ts";
import { hashers } from "/runtime/Hashers.ts";

const ss58 = C.ss58FromText("13SceNt2ELz3ti4rnQbY1snpYH4XE4fLFsW8ph9rpwJd6HFC");
const pubKey = C.pubKeyFromSs58(ss58);
const accountId32 = C.accountId32FromPubKey(pubKey);
const entry = C
  .pallet(POLKADOT_RPC_URL, "System")
  .entry("Account", accountId32)
  .read();
// console.log(C.Effect.state.remainingVisits);
const run = C.runtime({
  rpc: wsRpcClient,
  hashers,
});

const result = await run(entry);
console.log({ result });
// if (result instanceof Error) {}
// else {
//   console.log(result.getPalletByName("System"));
// }
