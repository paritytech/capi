import { assert } from "../_deps/asserts.ts";
import { polkadotBeacon } from "../known/mod.ts";
import * as C from "../mod.ts";
import * as rpc from "../rpc/mod.ts";

const client = await rpc.client(polkadotBeacon);
assert(!(client instanceof Error));
client;
const pallet = C.pallet(client, "System");
const map = C.map(pallet, "Account");
const result = await C.mapKeys(map, 10).run();
console.log({ result });
client.close();
