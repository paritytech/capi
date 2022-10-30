import * as known from "../known/rpc/mod.ts";
import { polkadot } from "../test_util/config.ts";
import { Client, proxyProvider } from "./mod.ts";

const client = new Client(proxyProvider, await polkadot.initDiscoveryValue());

const metadata = await client.call({
  jsonrpc: "2.0",
  id: client.providerRef.nextId(),
  method: "state_getMetadata",
  params: [],
});

if (metadata instanceof Error) {
  throw metadata;
} else if (metadata.error) {
  console.error(metadata.error);
} else {
  console.log(metadata.result);
}

class Counter {
  i = 0;
}

client.subscribe<"chain_subscribeAllHeads", known.Header>({
  jsonrpc: "2.0",
  id: client.providerRef.nextId(),
  method: "chain_subscribeAllHeads",
  params: [],
}, async function(event) {
  const counter = this.state(Counter);
  if (event instanceof Error) {
    throw event;
  } else if (event.error) {
    console.error(event.error);
  } else {
    console.log(event.params.result);
  }
  if (counter.i === 4) {
    this.stop();
    await client.discard();
  }
  counter.i += 1;
});
