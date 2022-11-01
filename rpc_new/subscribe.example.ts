import * as Z from "../deps/zones.ts";
import { run } from "../effects/run.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";
import { ClientSubscribeContext } from "./client.ts";
import * as E from "./effects.ts";
import { proxyProvider } from "./provider/proxy.ts";
import { Listener } from "./util.ts";

const client = E.client(proxyProvider, await T.polkadot.discoveryValue);

export namespace polkadot {
  export function getMetadata<Rest extends [blockHash?: Z.$<U.HexHash>]>(...rest: [...Rest]) {
    return E.call(client)<U.Hex>()("state_getMetadata", rest);
  }

  export function unsubscribeNewHeads<Id extends Z.$<string>>(id: Id) {
    return E.call(client)<true>()("chain_unsubscribeNewHeads", [id as Id]);
  }

  export function subscribeNewHeads<
    Listener_ extends Z.$<Listener<string, ClientSubscribeContext>>,
  >(listener: Listener_) {
    return E.subscription(client)<string>()("chain_subscribeNewHeads", [], listener);
  }
}

class Counter {
  i = 0;
}
const r = polkadot.subscribeNewHeads(function(x) {
  const counter = this.state(Counter);
  console.log(x);
  if (counter.i === 3) {
    this.stop();
  }
  counter.i++;
});
const un = polkadot.unsubscribeNewHeads(r);
const result = await run(un);
console.log(result);
