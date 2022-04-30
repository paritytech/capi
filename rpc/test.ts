import { POLKADOT_RPC_URL } from "/_/constants/chains/url.ts";
import { EgressMessage, MethodName } from "./method_info/mod.ts";
import { WsRpcClient } from "./ws.ts";

const client = new WsRpcClient(POLKADOT_RPC_URL);
await client.opening();
const id = client.uid();
const message: EgressMessage = {
  jsonrpc: "2.0",
  id,
  method: MethodName.StateGetMetadata,
  params: [],
};
const stopListening = client.listen(async (egressMessage) => {
  console.log(egressMessage);
  stopListening();
  await client.close();
});
client.send(message);
