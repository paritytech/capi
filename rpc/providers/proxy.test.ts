import { deferred } from "../../_deps/std/async.ts";
import { assert } from "../../_deps/std/testing/asserts.ts";
import { KnownRpcMethods, polkadot } from "../../known/mod.ts";
import * as msg from "../messages.ts";
import { proxyClient } from "./proxy.ts";

Deno.test({
  name: "Proxy RPC Client",
  sanitizeResources: false,
  sanitizeOps: false,
  async fn(t) {
    const client = await proxyClient<KnownRpcMethods>(polkadot.discoveryValue);
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
