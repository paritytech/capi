import * as C from "/mod.ts";

const rpc = await C.wsRpcClient(C.WESTEND_RPC_URL);
const $pallet = C.pallet(rpc, "System");
const $entry = C.entry($pallet, "Events");
const $read = C.read($entry);
const result = await $read.run();
console.log(result);
await rpc.close();
