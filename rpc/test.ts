import { POLKADOT_RPC_URL } from "/_/constants/chains/url.ts";
import { Init, IsCorrespondingNotif, IsCorrespondingRes, WsRpcClient } from "./mod.ts";

// Message vs. notification corresponds to

const client = new WsRpcClient(POLKADOT_RPC_URL);
await client.opening();

const stateGetMetadataInit: Init = {
  jsonrpc: "2.0",
  id: client.uid(),
  method: "state_getMetadata",
  params: [],
};
const isStateGetMetadataInit = IsCorrespondingRes(stateGetMetadataInit);

const stopListening = client.listen(async (res) => {
  if (isStateGetMetadataInit(res)) {
    res;
    console.log(res);
    stopListening();
    await client.close();
  }
});
client.send(stateGetMetadataInit);
