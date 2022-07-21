import { assert } from "../../_deps/std/testing/asserts.ts";
import { polkadot } from "../../known/mod.ts";
import * as rpc from "../../rpc/mod.ts";

const client = await rpc.fromConfig(polkadot);
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
