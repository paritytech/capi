import { assert } from "../../deps/std/testing/asserts.ts";
import { polkadot } from "../../known/mod.ts";
import * as rpc from "../../rpc/mod.ts";

const client = await rpc.stdClient(polkadot);
assert(!(client instanceof Error));

let i = 1;
await client.subscribe("chain_subscribeAllHeads", [], (stop) => {
  return async (message) => {
    console.log({ [i++]: message.params.result });
    if (i > 5) {
      stop();
      await client.close();
    }
  };
});
