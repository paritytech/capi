// TODO: test-ify this?
import { run } from "../effects/run.ts";
import { polkadot } from "../test_util/mod.ts";
import { client } from "./effects.ts";
import { chain } from "./known.ts";
import { proxyProvider } from "./provider/proxy.ts";

const client_ = client(proxyProvider, await polkadot.discoveryValue);

class Counter {
  i = 0;
}
const root = chain.unsubscribeNewHeads(client_)(
  chain.subscribeNewHeads(client_)([], function(header) {
    const counter = this.state(Counter);
    console.log(header);
    if (counter.i === 3) {
      return this.stop();
    }
    counter.i++;
  }),
);
const result = await run(root);
console.log(result);
