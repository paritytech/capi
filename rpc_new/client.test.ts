import { deferred } from "../deps/std/async.ts";
import {
  assert,
  assertEquals,
  assertExists,
  assertNotInstanceOf,
} from "../deps/std/testing/asserts.ts";
import * as known from "../known/rpc/mod.ts";
import * as T from "../test_util/mod.ts";
import * as msg from "./messages.ts";
import { Client, proxyProvider } from "./mod.ts";

Deno.test({
  name: "RPC Client",
  async fn(t) {
    const client = new Client(proxyProvider, await T.polkadot.initDiscoveryValue());

    await t.step({
      name: "call",
      sanitizeOps: false,
      sanitizeResources: false,
      async fn() {
        const metadata = await client.call({
          jsonrpc: "2.0",
          id: client.providerRef.nextId(),
          method: "state_getMetadata",
          params: [],
        });
        assertNotInstanceOf(metadata, Error);
        assert(!metadata.error);
        assertExists(metadata.result);
      },
    });

    await t.step({
      name: "subscribe",
      sanitizeOps: false,
      sanitizeResources: false,
      async fn() {
        const stopped = deferred();
        let subscriptionId;
        const events: msg.NotificationMessage<"chain_subscribeAllHeads", known.Header>[] = [];
        class Counter {
          i = 0;
        }
        client.subscribe<"chain_subscribeAllHeads", known.Header>({
          jsonrpc: "2.0",
          id: client.providerRef.nextId(),
          method: "chain_subscribeAllHeads",
          params: [],
        }, function(event) {
          const counter = this.state(Counter);
          assertNotInstanceOf(event, Error);
          assert(!event.error);
          assertExists(event.params.result.parentHash);
          subscriptionId = event.params.subscription;
          events.push(event);
          if (counter.i === 2) {
            this.stop();
            return;
          }
          counter.i++;
        }, (subscriptionId) => {
          stopped.resolve(subscriptionId);
        });
        const stoppedSubscriptionId = await stopped;
        assertEquals(events.length, 3);
        assertEquals(stoppedSubscriptionId, subscriptionId);
      },
    });

    await client.discard();
  },
});
