import { polkadot } from "../test_util/config.ts";
import { Client } from "./client.ts";
import { proxyProvider } from "./provider/proxy.ts";

const client = new Client(proxyProvider, await polkadot.initDiscoveryValue());
const result = await client.call({
  jsonrpc: "2.0",
  id: "0",
  method: "state_getMetadata",
  params: [],
});
await client.close();
console.log(result);
