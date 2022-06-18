import { westendBeacon } from "../known/westend.ts";
import * as C from "../mod.ts";
import { rpcClient } from "../rpc/mod.ts";

const rpc = await rpcClient(westendBeacon);
const $pallet = C.pallet(rpc, "System");
const $entry = C.entry($pallet, "Events");
const $read = C.read($entry);
const result = await $read.run();
console.log(result);
await rpc.close();
