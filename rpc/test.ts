import { POLKADOT_RPC_URL } from "/_/constants/chains/url.ts";
import { MethodName, wsConnectionPool } from "./mod.ts";

const connections = wsConnectionPool();
const connection = await connections.use(POLKADOT_RPC_URL);
const result = await connection.ask({
  id: connection.nextId,
  method: MethodName.ChainGetBlock,
  params: [],
});
console.log(result);
await connection.deref();
