import * as C from "../mod.ts";

const client = await C.wsRpcClient(C.POLKADOT_RPC_URL);
const $blockHash = C.rpcCall(client, "chain_getBlockHash");
const blockHash = await $blockHash.run();
if (blockHash instanceof Error) {
  throw blockHash;
}
console.log(blockHash);
await client.close();
