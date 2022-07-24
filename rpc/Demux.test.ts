import { assert } from "../deps/std/testing/asserts.ts";
import { KnownRpcMethods } from "../known/mod.ts";
import { ctx } from "../test-util/mod.ts";
import * as msg from "./messages.ts";
import { proxyClient } from "./providers/proxy.ts";

Deno.test({
  name: "Demuxing RPC Subscriptions",
  sanitizeResources: false,
  sanitizeOps: false,
  ignore: true,
  async fn() {
    await ctx(async (config) => {
      const client = await proxyClient<typeof config["_"][0]>(config.discoveryValue);
      assert(!(client instanceof Error));
      const groups = await Promise.all(
        (<msg.NotifMessage<KnownRpcMethods, "chain_subscribeAllHeads">[][]> [[], [], []]).map(
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
    });
  },
});
