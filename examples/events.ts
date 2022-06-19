import { assert } from "../_deps/asserts.ts";
import { westendBeacon } from "../known/mod.ts";
import * as C from "../mod.ts";
import { rpcClient } from "../rpc/mod.ts";

const client = await rpcClient(...westendBeacon);
assert(!(client instanceof Error));
const $pallet = C.pallet(client, "System");
const $entry = C.entry($pallet, "Events");
const $read = C.read($entry);
const result = await $read.run();
console.log(result);
await client.close();
