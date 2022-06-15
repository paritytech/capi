import * as C from "../../mod.ts";

const client = await C.wsRpcClient(C.POLKADOT_RPC_URL);
const subscription = new C.Subscription(client, "chain_subscribeAllHeads", []);
for await (const notif of subscription) {
  console.log(notif);
}
