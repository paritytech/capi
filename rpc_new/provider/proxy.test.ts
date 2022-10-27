import * as T from "../../test_util/mod.ts";
import { proxyProvider } from "./proxy.ts";

const discoveryValue = await T.polkadot.initDiscoveryValue();

const provider = proxyProvider(discoveryValue, async (message) => {
  console.log(message);
  await provider.release();
});

await provider.send({
  jsonrpc: "2.0",
  id: "0",
  method: "system_health",
  params: [],
});
