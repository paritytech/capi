import { assert } from "../../_deps/asserts.ts";
import { polkadotBeacon } from "../../known/mod.ts";
import { rpcClient } from "../../rpc/mod.ts";

const client = await rpcClient(...polkadotBeacon);
assert(!(client instanceof Error));
const stop = await client.subscribe("chain_subscribeAllHeads", [], (message) => {
  console.log(message.params.result);
});
assert(typeof stop === "function");
setTimeout(async () => {
  stop();
  await client.close();
}, 100000);
