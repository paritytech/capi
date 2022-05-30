import * as bindings from "/bindings/mod.ts";
import * as C from "/mod.ts";

const $events = C.pallet(C.WESTEND_RPC_URL, "System").entry("Events").read();
const result = await C.runtime({
  ...bindings.hashersR,
  rpc: C.wsRpcClient,
})($events);
console.log(result);
