import * as C from "../mod.ts";
import { wsRpcClient } from "../rpc/mod.ts";

const rpc = await wsRpcClient(C.POLKADOT_RPC_URL);
const pallet = C.pallet(rpc, "System");
const map = C.map(pallet, "Account");
const result = await C.mapKeys(map, 10).run();

console.log({ result });

rpc.close();
