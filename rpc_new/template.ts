// TODO: generate the following based on a desc of std methods

import * as Z from "../deps/zones.ts";
import * as known from "../known/rpc/mod.ts";
import * as U from "../util/mod.ts";
import { ClientSubscribeContext } from "./client.ts";
import { call, client, subscription } from "./effects.ts";
import { Provider } from "./mod.ts";
import { Listener } from "./util.ts";

// capi-codegen-replacement-start
type DiscoveryValue = any;
declare const provider: Provider<DiscoveryValue, any, any, any>;
declare const discoveryValue: DiscoveryValue;
// capi-codegen-replacement-end

const client_ = client(provider, discoveryValue);

export namespace state {
  export function getMetadata<Rest extends [blockHash?: Z.$<U.HexHash>]>(...rest: [...Rest]) {
    return call(client_)<U.Hex>()("state_getMetadata", rest);
  }
}
export namespace chain {
  export function unsubscribeNewHeads<Id extends Z.$<string>>(id: Id) {
    return call(client_)<true>()("chain_unsubscribeNewHeads", [id]);
  }

  export function subscribeNewHeads<
    Listener_ extends Z.$<Listener<known.Header, ClientSubscribeContext>>,
  >(listener: Listener_) {
    return subscription(client_)<known.Header>()("chain_subscribeNewHeads", [], listener);
  }
}
