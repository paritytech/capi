import * as C from "../mod.ts";
import { wsRpcClient } from "../rpc/mod.ts";

const rpc = await wsRpcClient(C.POLKADOT_RPC_URL);
const $metadata = C.metadata(rpc);
const result = await $metadata.run();
if (result instanceof Error) {
  throw result;
}
console.log(result);
await rpc.close();
