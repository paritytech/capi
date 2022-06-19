import { polkadotBeacon } from "../known/mod.ts";
import * as C from "../mod.ts";
import { rpcClient } from "../rpc/mod.ts";

const rpc = await rpcClient(polkadotBeacon);
const pallet = C.pallet(rpc, "System");
const map = C.map(pallet, "Account");
const result = await C.mapKeys(map, 10).run();

console.log({ result });

rpc.close();
