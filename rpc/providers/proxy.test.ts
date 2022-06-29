import { assert, assertEquals } from "../../_deps/asserts.ts";
import { assertSpyCall, assertSpyCalls, spy } from "../../_deps/mock.ts";
import { KnownRpcMethods } from "../../known/mod.ts";
import { node } from "../../test-util/node.ts";
import { ProxyBeacon, proxyClient } from "./proxy.ts";

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

Deno.test({
  name: "Test proxyClient send",
  fn: async (s: Deno.TestContext) => {
    // Initialize local node
    const process = await node();

    // Create the proxyClient
    const hooks = {
      close: spy(() => {}),
      send: spy((_msg: any) => {}),
      receive: spy((_msg: any) => {}),
      error: spy((_err: any) => {}),
    };
    const client = await proxyClient(new ProxyBeacon<KnownRpcMethods>(process.url), hooks);
    // Make sure that client did not return an error
    assert(!(client instanceof Error));

    // start running tests
    await s.step({
      name: "Tests send",
      fn: async () => {
        const jsonSend = {
          id: "0",
          jsonrpc: "2.0",
          method: "state_getMetadata",
          params: [],
        };
        const raw = await client.call("state_getMetadata", []);
        assertSpyCalls(hooks.send, 1);
        assert(raw.result);
        assertSpyCall(hooks.send, 0, { args: [jsonSend] });
        assertSpyCalls(hooks.receive, 1);
      },
    });

    // even though CAPI is not allowing this so this tests should probably not be here
    await s.step({
      name: "Tests error when a call is made with wrong method",
      fn: async () => {
        const expectedError = {
          id: "1",
          jsonrpc: "2.0",
          error: { code: -32601, message: "Method not found" },
        };
        await client.call("state_getMetaSomething" as keyof KnownRpcMethods, []);
        assertSpyCall(hooks.receive, 1, { args: [expectedError] });
      },
    });

    await s.step({
      name: "Tests that id increments correctly",
      fn: async () => {
        const raw = await client.call("state_getMetadata", []);
        assertEquals(raw.id, "2");
      },
    });

    await s.step({
      name: "Tests proxyClient subscribe",
      fn: async () => {
        const listenerSpy = spy((): void => {});

        await client.subscribe(
          "chain_subscribeNewHead",
          [],
          listenerSpy,
        );
        // 5 seconds delay to ensure that 2 heads were received
        await delay(5000);
        assertSpyCalls(listenerSpy, 2);
      },
    });

    await client.close();
    assertSpyCalls(hooks.close, 1);
    process.close();
  },
  sanitizeResources: false,
});
