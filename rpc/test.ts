import { POLKADOT_RPC_URL } from "/_/constants/chains/url.ts";
import * as a from "std/async/mod.ts";
import { Init, IsCorrespondingRes, StateGetMetadataRes, wsRpcClient } from "./mod.ts";

const client = await wsRpcClient(POLKADOT_RPC_URL);

const stateGetMetadataInit: Init = {
  jsonrpc: "2.0",
  id: client.uid(),
  method: "state_getMetadata",
  params: [],
};

const isStateGetMetadataInit = IsCorrespondingRes(stateGetMetadataInit);
const pending = a.deferred<StateGetMetadataRes>();
const stopListening = client.listen(async (res) => {
  if (isStateGetMetadataInit(res)) {
    pending.resolve(res);
  }
});
client.send(stateGetMetadataInit);
console.log(await pending);
// console.log(await a.deadline(pending, 800));
stopListening();
await client.close();
