import { POLKADOT_RPC_URL } from "/_/constants/chains/url.ts";
import { deferred } from "std/async/mod.ts";
import { ConnectionMessage, MethodName, wsConnectionPool } from "./mod.ts";

const connections = wsConnectionPool();
const connection = await connections.use(POLKADOT_RPC_URL);
const payload = connection.payload(MethodName.ChainSubscribeAllHeads);
const stopListening = connection.addListener((e) => {
  // check against payload
});
payload.send();

// const payload = connection.payload(MethodName.ChainGetBlock);
// const pending = deferred<ConnectionMessage<MethodName.ChainGetBlock>>();
// const handle = (e: ConnectionMessage<MethodName.ChainGetBlock>) => {
//   connection.off(handle);
//   pending.resolve(e);
// };
// connection.on(payload, handle);
// connection.send(payload);
// const answer = await pending;
// console.log(answer.result.block);

connection.send(payload);

// await connection.deref();
