import * as C from "../mod.ts";
import { wsRpcClient } from "../rpc/mod.ts";

const ss58 = C.ss58FromText("13SceNt2ELz3ti4rnQbY1snpYH4XE4fLFsW8ph9rpwJd6HFC");
const pubKey = C.pubKeyFromSs58(ss58);
const accountId32 = C.accountId32FromPubKey(pubKey);
const rpc = await wsRpcClient(C.POLKADOT_RPC_URL);
const pallet = C.pallet(rpc, "System");
const map = C.map(pallet, "Account");
const entry = C.mapEntry(map, accountId32);
const result = await C.read(entry).run();

console.log({ result });

rpc.close();
