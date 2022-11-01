import * as Z from "../../zones/mod.ts";
import { run } from "../effects/run.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";
import { ClientSubscribeContext } from "./client.ts";
import * as E from "./effects.ts";
import { proxyProvider } from "./provider/proxy.ts";
import { Listener } from "./util.ts";

// const root = myCall(await T.polkadot.discoveryValue);

// console.log(U.throwIfError(await C.run(root)));

// function myCall(discoveryValue: any) {
//   const client = E.client(proxyProvider, discoveryValue);
//   const call = E.call(client)();
//   return call("rpc_methods", []);
// }

const client = E.client(proxyProvider, await T.polkadot.discoveryValue);

export namespace polkadot {
  /**
   * Some description
   * @param blockHash some description
   */
  export function getMetadata<Rest extends [blockHash?: Z.$<U.HexHash>]>(...[blockHash]: Rest) {
    return E.call(client)<U.Hex>()("state_getMetadata", [blockHash]);
  }

  export function unsubscribeNewHeads<Id extends Z.$<string>>(id: Id) {
    return E.call(client)<true>()("chain_unsubscribeNewHeads", [id]);
  }

  export function subscribeNewHeads<
    Listener_ extends Z.$<Listener<string, ClientSubscribeContext>>,
  >(listener: Listener_) {
    return E.subscription(client as any)<string>()("chain_subscribeNewHeads", [], listener);
  }
}

//

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
const result = await run(un, undefined!);
console.log(result);
