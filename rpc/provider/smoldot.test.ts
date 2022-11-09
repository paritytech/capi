// TODO
import { deferred } from "../../deps/std/async.ts";
import { assertExists, assertNotInstanceOf } from "../../deps/std/testing/asserts.ts";
import { ProviderListener } from "./base.ts";
import { smoldotProvider } from "./smoldot.ts";

const POLKADOT_CHAIN_SPEC_URL =
  "https://raw.githubusercontent.com/paritytech/substrate-connect/main/packages/connect/src/connector/specs/polkadot.json";

Deno.test({
  name: "Smoldot Provider",
  sanitizeOps: false,
  sanitizeResources: false,
  async fn() {
    const polkadotChainSpec = await (await fetch(POLKADOT_CHAIN_SPEC_URL)).text();
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
    const provider = smoldotProvider(polkadotChainSpec, (message) => {
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
      params: [true],
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
    await provider.release();
  },
});
