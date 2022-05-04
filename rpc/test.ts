import { POLKADOT_RPC_URL } from "/_/constants/chains/url.ts";
import { call, rpcClientPool, subscribe, wsRpcClient } from "./mod.ts";

const pool = rpcClientPool(wsRpcClient);
const client = await pool.ref(POLKADOT_RPC_URL);

// const stopListening = await subscribe(client, "chain_subscribeAllHeads", [], (message) => {
//   message;
//   console.log(message);
// });
// setTimeout(() => {
//   stopListening();
//   pool.deref(POLKADOT_RPC_URL);
// }, 100000);

const result = await call(client, "state_getMetadata", []);
console.log(result);
pool.deref(POLKADOT_RPC_URL);
