import { assert } from "../../_deps/asserts.ts";
import { polkadotBeacon } from "../../known/mod.ts";
import * as rpc from "../../rpc/mod.ts";

const client = await rpc.proxyClient(polkadotBeacon);
assert(!(client instanceof Error));

let i = 1;
const stop = await client.subscribe("chain_subscribeAllHeads", [], async (message) => {
  console.log({ [i++]: message.params.result });
  if (i > 5) {
    assert(typeof stop === "function");
    stop();
    await client.close();
  }
});
