import * as T from "../test_util/mod.ts";
import { proxyProviderFactory } from "./proxy.ts";

const discoveryValue = await T.polkadot.initDiscoveryValue();

const provider = proxyProviderFactory(discoveryValue, (event) => {
  if (event instanceof Event) {}
  else {
    console.log(JSON.stringify(event));
    return provider.release();
  }
  return;
});
provider.send({
  jsonrpc: "2.0",
  id: "0",
  method: "system_health",
  params: [],
});
