import { polkadotBeacon } from "../known/mod.ts";
import * as C from "../mod.ts";
import { rpcClient } from "../rpc/mod.ts";

const client = await rpcClient(polkadotBeacon);
const pallet = C.pallet(client, "System");
const map = C.map(pallet, "Account");
const result = await C.mapKeys(map, 10).run();

console.log({ result });

client.close();
