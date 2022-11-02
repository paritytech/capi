import { client } from "./effects.ts";
import * as k from "./known.ts";
import { Provider } from "./mod.ts";

// capi-codegen-replacement-start
type DiscoveryValue = any;
declare const provider: Provider<DiscoveryValue, any, any, any>;
declare const discoveryValue: DiscoveryValue;
// capi-codegen-replacement-end

const client_ = client(provider, discoveryValue);

export namespace state {
  export const getMetadata = k.state.getMetadata(client_);
}
export namespace chain {
  export const subscribeNewHeads = k.chain.subscribeNewHeads(client_);
  export const unsubscribeNewHeads = k.chain.unsubscribeNewHeads(client_);
}
