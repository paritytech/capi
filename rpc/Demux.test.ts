import { assert } from "../deps/std/testing/asserts.ts";
import { KnownRpcMethods, polkadot } from "../known/mod.ts";
import { Demux } from "./Demux.ts";
import * as msg from "./messages.ts";
import { proxyClient } from "./providers/proxy.ts";

Deno.test({
  name: "Demuxing RPC Subscriptions",
  sanitizeResources: false,
  sanitizeOps: false,
  async fn() {
    const client = await proxyClient<KnownRpcMethods>(polkadot.discoveryValue);
    assert(!(client instanceof Error));
    const demux = new Demux(client);

    const groups = await Promise.all(
      (<msg.NotifMessage<KnownRpcMethods, "chain_subscribeAllHeads">[][]> [[], [], []]).map(
        async (messages) => {
          let i = 1;
          await demux.subscribe("chain_subscribeAllHeads", [], (stop) => {
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

    assert(groups.every((group) => {
      return group.every((message) => {
        return message.params.result;
      });
    }));

    await client.close();
  },
});
