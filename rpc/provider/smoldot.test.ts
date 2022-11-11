import { deferred } from "../../deps/std/async.ts";
import { assertExists, assertNotInstanceOf } from "../../deps/std/testing/asserts.ts";
import { ProviderListener } from "./base.ts";
import { smoldotProvider } from "./smoldot.ts";

Deno.test({
  name: "Smoldot Provider",
  sanitizeOps: false,
  sanitizeResources: false,
  async fn(t) {
    await t.step({
      name: "relay chain connection",
      async fn() {
        const relayChainSpec = await (
          await fetch(
            "https://raw.githubusercontent.com/paritytech/substrate-connect/main/packages/connect/src/connector/specs/polkadot.json",
          )
        )
          .text();
        const pendingSubscriptionId = deferred<string>();
        const initialized = deferred();
        const unsubscribed = deferred();
        const checks: ProviderListener<any, any>[] = [
          // check for chainHead_unstable_follow subscription
          (message) => {
            assertNotInstanceOf(message, Error);
            assertExists(message.result);
            pendingSubscriptionId.resolve(message.result);
          },
          // check for chainHead_unstable_follow initialized event
          (message) => {
            assertNotInstanceOf(message, Error);
            assertExists(message.params?.result);
            if (message.params?.result.event === "initialized") {
              initialized.resolve();
            }
          },
          // check for chainHead_unstable_unfollow unsubscribe
          (message) => {
            assertNotInstanceOf(message, Error);
            if (message?.result === null) {
              unsubscribed.resolve();
            }
          },
        ];
        const provider = smoldotProvider(relayChainSpec, (message) => {
          if (checks.length > 1) {
            checks.shift()!(message);
          } else {
            checks[0]!(message);
          }
        });
        provider.send({
          jsonrpc: "2.0",
          id: provider.nextId(),
          method: "chainHead_unstable_follow",
          params: [false],
        });
        const subscriptionId = await pendingSubscriptionId;
        await initialized;
        provider.send({
          jsonrpc: "2.0",
          id: provider.nextId(),
          method: "chainHead_unstable_unfollow",
          params: [subscriptionId],
        });
        await unsubscribed;
        const providerRelease = await provider.release();
        assertNotInstanceOf(providerRelease, Error);
      },
    });
    await t.step({
      name: "parachain connection",
      async fn() {
        const relayChainSpec = await (
          await fetch(
            "https://raw.githubusercontent.com/paritytech/substrate-connect/main/packages/connect/src/connector/specs/westend2.json",
          )
        )
          .text();
        const parachainSpec = await (
          await fetch(
            "https://raw.githubusercontent.com/paritytech/substrate-connect/main/projects/demo/src/assets/westend-westmint.json",
          )
        )
          .text();
        const pendingSubscriptionId = deferred<string>();
        const initialized = deferred();
        const unsubscribed = deferred();
        const checks: ProviderListener<any, any>[] = [
          // check for chainHead_unstable_follow subscription
          (message) => {
            assertNotInstanceOf(message, Error);
            assertExists(message.result);
            pendingSubscriptionId.resolve(message.result);
          },
          // check for chainHead_unstable_follow initialized event
          (message) => {
            assertNotInstanceOf(message, Error);
            assertExists(message.params?.result);
            if (message.params?.result.event === "initialized") {
              initialized.resolve();
            }
          },
          // check for chainHead_unstable_unfollow unsubscribe
          (message) => {
            assertNotInstanceOf(message, Error);
            if (message?.result === null) {
              unsubscribed.resolve();
            }
          },
        ];
        const provider = smoldotProvider(
          [parachainSpec, relayChainSpec],
          (message) => {
            if (checks.length > 1) {
              checks.shift()!(message);
            } else {
              checks[0]!(message);
            }
          },
        );
        provider.send({
          jsonrpc: "2.0",
          id: provider.nextId(),
          method: "chainHead_unstable_follow",
          params: [false],
        });
        const subscriptionId = await pendingSubscriptionId;
        await initialized;
        provider.send({
          jsonrpc: "2.0",
          id: provider.nextId(),
          method: "chainHead_unstable_unfollow",
          params: [subscriptionId],
        });
        await unsubscribed;
        const providerRelease = await provider.release();
        assertNotInstanceOf(providerRelease, Error);
      },
    });
  },
});
