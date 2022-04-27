import { POLKADOT_RPC_URL } from "/_/constants/chains/url.ts";
import { STATE__GET_METADATA } from "./base.ts";
import { WsConnectionContext } from "./ws.ts";

const connections = new WsConnectionContext();
const connection = await connections.use(POLKADOT_RPC_URL);
const result = await connection.ask({
  id: connection.nextId,
  method: STATE__GET_METADATA,
  params: [],
});
console.log(result);
await connection.deref();
