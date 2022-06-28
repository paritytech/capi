import { assert, assertEquals } from "../../_deps/asserts.ts";
import { KnownRpcMethods } from "../../known/mod.ts";
import { node } from "../../test-util/node.ts";
import { proxyClient, ProxyBeacon } from "./proxy.ts";

Deno.test({
  name: "Test proxyClient flow",
  fn: async (s) => {
    // Initialize local node
    const process = await node();
    // Create the proxyClient
    const client = await proxyClient(new ProxyBeacon<KnownRpcMethods>(process.url), {
      close() {},
      send(_msg) {},
      receive(_msg) {},
      error() {},
    });
    // Make sure that client did not return an error
    assert(!(client instanceof Error));

    // start running tests
    await s.step({
      name: "Tests correct functionality",
      fn: async () => {
        const raw = await client.call("state_getMetadata", []);
        assert(raw.result);
      }
    });

    // even though CAPI is not allowing this so this tests should probably not be here
    await s.step({
      name: "Tests error when a call is made with wrong method",
      fn: async () => {
        const raw = await client.call("state_getMetaSomething" as keyof KnownRpcMethods, []);
        assert(raw.error);
        assertEquals(raw.error.message, "Method not found");
      },
    });

    await s.step({
      name: "Tests that id increments correctly",
      fn: async () => {
        const raw = await client.call("state_getMetadata", []);
        assertEquals(raw.id, "2");
      },
    });

    // Finally
    await client.close();
    process.close();
  },
  sanitizeResources: false,
});

