import { assert } from "../../deps/std/testing/asserts.ts";
import { polkadot } from "../../known/mod.ts";
import * as msg from "../messages.ts";
import { proxyClient } from "./proxy.ts";

Deno.test({
  name: "Proxy RPC Client",
  sanitizeResources: false,
  async fn(t) {
    const client = proxyClient(polkadot);
    assert(!(client instanceof Error));

    await t.step({
      name: "call",
      fn: async () => {
        const raw = await client.call("state_getMetadata", []);
        assert(typeof raw.result === "string");
      },
    });

    await t.step({
      name: "subscribe",
      fn: async () => {
        const result: msg.NotifMessage<typeof polkadot, "chain_subscribeAllHeads">[] = [];
        let i = 1;
        await client.subscribe("chain_subscribeAllHeads", [], (stop) => {
          return (message) => {
            result.push(message);
            i++;
            if (i > 2) {
              stop();
            }
          };
        });
        assert(result.every((message) => {
          return message.params.result;
        }));
      },
    });

    await client.close();
  },
});
