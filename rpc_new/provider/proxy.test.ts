import { deferred } from "../../deps/std/async.ts";
import { assertExists, assertNotInstanceOf } from "../../deps/std/testing/asserts.ts";
import * as T from "../../test_util/mod.ts";
import { proxyProvider } from "./proxy.ts";

Deno.test({
  name: "Proxy Provider",
  async fn() {
    const stopped = deferred();
    const provider = await proxyProvider(
      await T.polkadot.initDiscoveryValue(),
      (message) => {
        assertNotInstanceOf(message, Error);
        assertExists(message.result);
        stopped.resolve();
      },
    );
    provider.send({
      jsonrpc: "2.0",
      id: provider.nextId(),
      method: "system_health",
      params: [],
    });
    await stopped;
    const providerRelease = await provider.release();
    assertNotInstanceOf(providerRelease, Error);
  },
});
