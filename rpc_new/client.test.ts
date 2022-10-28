import { delay } from "../deps/std/async.ts";
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
console.log(result);

// client.subscribe(
//   {
//     jsonrpc: "2.0",
//     id: "1",
//     method: "chain_subscribeNewHead",
//     params: [],
//   },
//   (message) => {
//     console.log(message);
//   },
// );

client.subscribeWithStop(
  {
    jsonrpc: "2.0",
    id: "1",
    method: "chain_subscribeNewHead",
    params: [],
  },
  (stop) => {
    let i = 0;
    return (message) => {
      console.log(message);
      if (++i === 3) {
        stop();
      }
    };
  },
);

await delay(30000);

await client.close();
