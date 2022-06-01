import * as C from "/mod.ts";

const rpc = await C.wsRpcClient(C.POLKADOT_RPC_URL);
const $metadata = C.metadata(rpc);
const result = await $metadata.run();
if (result instanceof Error) {
  throw result;
}
console.log(result.types[192]);
await rpc.close();
