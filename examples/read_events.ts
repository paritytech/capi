import * as crypto from "/crypto/mod.ts";
import * as C from "/mod.ts";

const $events = C.pallet(C.WESTEND_RPC_URL, "System").entry("Events").read();
const result = await C.runtime({
  ...crypto.hashersR,
  rpc: C.wsRpcClient,
})($events);
console.log(result);
