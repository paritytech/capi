import * as C from "../mod.ts";
import { wsRpcClient } from "../rpc/mod.ts";

const client = await wsRpcClient(C.POLKADOT_RPC_URL);
const $blockHash = C.rpcCall(client, "chain_getBlockHash");
const blockHash = await $blockHash.run();
if (blockHash instanceof Error) {
  throw blockHash;
}
console.log(blockHash);
await client.close();
