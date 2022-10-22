import { assert } from "../../deps/std/testing/asserts.ts";
import * as T from "../../test_util/mod.ts";
import * as U from "../../util/mod.ts";
import * as msg from "../messages.ts";
import { proxyClient } from "./proxy.ts";

Deno.test({
  name: "Proxy RPC Client",
  sanitizeResources: false,
  sanitizeOps: false,
  async fn(t) {
    const client = U.throwIfError(await proxyClient(T.polkadot));

    await t.step("call", async () => {
      const raw = await client.call("state_getMetadata", []);
      assert(typeof raw.result === "string");
    });

    await t.step("subscribe", async () => {
      const result: msg.NotifMessage[] = [];
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
    });

    await client.close();
  },
});
