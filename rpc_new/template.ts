// TODO: generate the following based on a desc of std methods
import * as k from "./known.ts";

import * as Z from "../deps/zones.ts";
import * as known from "../known/rpc/mod.ts";
import * as U from "../util/mod.ts";
import { ClientSubscribeContext } from "./client.ts";
import { client } from "./effects.ts";
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
    return k.state.getMetadata(client_)(...rest);
  }
}
export namespace chain {
  export function subscribeNewHeads<
    Listener_ extends Z.$<Listener<known.Header, ClientSubscribeContext>>,
  >(listener: Listener_) {
    return k.chain.unsubscribeNewHeads(client_)([], listener);
  }
  export function unsubscribeNewHeads<Id extends Z.$<string>>(id: Id) {
    return k.chain.unsubscribeNewHeads(client_)(id);
  }
}
