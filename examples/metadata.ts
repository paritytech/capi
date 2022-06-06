import * as C from "/mod.ts";

await C.init();

const rpc = await C.wsRpcClient(C.POLKADOT_RPC_URL);
const $metadata = C.metadata(rpc);
const result = await $metadata.run();
if (result instanceof Error) {
  throw result;
}
console.log(result);
await rpc.close();
