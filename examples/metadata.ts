import * as C from "/mod.ts";

const rpc = await C.wsRpcClient(C.POLKADOT_RPC_URL);
const $metadata = C.metadata(rpc);
const result = await $metadata.run();
console.log(result);
await rpc.close();
