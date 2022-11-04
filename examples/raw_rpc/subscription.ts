import { assertNotInstanceOf } from "../../deps/std/testing/asserts.ts";
import * as T from "../../test_util/mod.ts";
import * as U from "../../util/mod.ts";

const client = await T.polkadot.client;

const subscriptionId = await client.subscribe({
  jsonrpc: "2.0",
  id: client.providerRef.nextId(),
  method: "chain_subscribeAllHeads",
  params: [],
}, function(e) {
  assertNotInstanceOf(e, Error);
  console.log(e);
  const counter = this.state(U.Counter);
  if (counter.i === 2) {
    return this.stop();
  }
  counter.inc();
});

const unsubscribed = await client.call({
  jsonrpc: "2.0",
  id: client.providerRef.nextId(),
  method: "chain_unsubscribeAllHeads",
  params: [],
});

console.log(
  `${unsubscribed ? "" : "un"}successfully unsubscribed from subscription ${subscriptionId}`,
);

await client.discard();
