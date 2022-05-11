import { POLKADOT_RPC_URL } from "/_/constants/chains/url.ts";
import { call, wsRpcClient } from "./mod.ts";

const client = await wsRpcClient(POLKADOT_RPC_URL);

// const stopListening = await subscribe(client, "chain_subscribeAllHeads", [], (message) => {
//   message;
//   console.log(message);
// });
// setTimeout(() => {
//   stopListening();
//   pool.deref(POLKADOT_RPC_URL);
// }, 100000);

const result = await call(client, "state_getMetadata", []);
await client.close();
console.log(result);
