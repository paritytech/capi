import { assert } from "../../_deps/asserts.ts";
import { deferred } from "../../_deps/async.ts";
import { KnownRpcMethods } from "../../known/mod.ts";
import { node } from "../../test-util/node.ts";
import * as msg from "../messages.ts";
import { ProxyBeacon, proxyClient } from "./proxy.ts";

Deno.test({
  name: "Proxy RPC Client",
  sanitizeResources: false,
  async fn(t) {
    const n = await node();
    const client = await proxyClient(new ProxyBeacon<KnownRpcMethods>(n.url));
    assert(!(client instanceof Error));

    await t.step("call", async () => {
      const raw = await client.call("state_getMetadata", []);
      assert(typeof raw.result === "string");
    });

    await t.step("subscribe", async () => {
      const result: msg.NotifMessage<KnownRpcMethods, "chain_subscribeAllHeads">[] = [];
      const pending = deferred();
      let i = 1;
      const stop = await client.subscribe("chain_subscribeAllHeads", [], async (message) => {
        result.push(message);
        i++;
        if (i > 2) {
          assert(typeof stop === "function");
          stop();
          pending.resolve();
        }
      });
      await pending;
      assert(result.every((message) => {
        return message.params.result;
      }));
    });

    await client.close();
  },
});
