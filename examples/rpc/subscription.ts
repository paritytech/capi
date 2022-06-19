import { polkadotBeacon } from "../../known/mod.ts";
import { rpcClient } from "../../rpc/mod.ts";

const client = await rpcClient(polkadotBeacon);
const stop = await client.subscribe("chain_subscribeAllHeads", [], (message) => {
  console.log(message.params.result);
});
setTimeout(async () => {
  stop();
  await client.close();
}, 100000);
