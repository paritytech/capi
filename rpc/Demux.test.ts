import { assert } from "../deps/std/testing/asserts.ts";
import * as T from "../test_util/mod.ts";
import * as msg from "./messages.ts";
import { proxyClient } from "./providers/proxy.ts";

Deno.test({
  name: "Demuxing RPC Subscriptions",
  sanitizeResources: false,
  sanitizeOps: false,
  ignore: true,
  async fn() {
    const client = await proxyClient(T.polkadot);
    assert(!(client instanceof Error));
    const groups = await Promise.all(
      (<msg.NotifMessage<T.polkadot, "chain_subscribeAllHeads">[][]> [[], [], []]).map(
        async (messages) => {
          let i = 1;
          await client.subscribe("chain_subscribeAllHeads", [], (stop) => {
            return (message) => {
              messages.push(message);
              i++;
              if (i > 2) {
                stop();
              }
            };
          });
          return messages;
        },
      ),
    );
    await client.close();
    assert(groups.every((group) => {
      return group.every((message) => {
        return message.params.result;
      });
    }));
  },
});
