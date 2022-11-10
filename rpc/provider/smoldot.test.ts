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

const WESTEND_CHAIN_SPEC_URL =
  "https://raw.githubusercontent.com/paritytech/substrate-connect/main/packages/connect/src/connector/specs/polkadot.json";

// For some reason westmint does not initializes. We need to find a more updated chainspec (or some other spec)
const WESTMINT_PARACHAIN_SPEC_URL =
  "https://raw.githubusercontent.com/paritytech/cumulus/master/parachains/chain-specs/westmint.json";

Deno.test({
  name: "Smoldot Relay/Parachain test",
  sanitizeOps: false,
  sanitizeResources: false,
  async fn() {
    const westendSpec = await (await fetch(WESTEND_CHAIN_SPEC_URL)).text();
    let parachainSpec = await (await fetch(WESTMINT_PARACHAIN_SPEC_URL)).text();

    parachainSpec = parachainSpec.replace("\"westend\"", "\"polkadot\"");

    const pendingSubscriptionId = deferred<string>();
    const pendingParaSubscriptionId = deferred<string>();
    const initialized = deferred();
    const unsubscribed = deferred();
    const initializedPara = deferred();
    const unsubscribedPara = deferred();

    const checksPara: ProviderListener<any, any>[] = [
      // check for chainHead_unstable_follow subscription
      (message) => {
        assertNotInstanceOf(message, Error);
        assertExists(message.result);
        pendingParaSubscriptionId.resolve(message.result);
      },
      // check for chainHead_unstable_follow initialized event
      (message) => {
        assertNotInstanceOf(message, Error);
        assertExists(message.params?.result);
        if (message.params?.result.event === "initialized") {
          initializedPara.resolve();
        }
      },
      // check for chainHead_unstable_unfollow unsubscribe
      (message) => {
        assertNotInstanceOf(message, Error);
        if (message?.result === null) {
          unsubscribedPara.resolve();
        }
      },
    ];

    const checksRelay: ProviderListener<any, any>[] = [
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

    const provider = smoldotProvider(westendSpec, (message) => {
      if (checksRelay.length > 1) {
        checksRelay.shift()!(message);
      } else {
        checksRelay[0]!(message);
      }
    });

    const para = smoldotProvider(parachainSpec, (message) => {
      if (checksPara.length > 1) {
        checksPara.shift()!(message);
      } else {
        checksPara[0]!(message);
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

    para.send({
      jsonrpc: "2.0",
      id: para.nextId(),
      method: "chainHead_unstable_follow",
      params: [true],
    });

    const paraSubscriptionId = await pendingParaSubscriptionId;
    await initializedPara;
    para.send({
      jsonrpc: "2.0",
      id: para.nextId(),
      method: "chainHead_unstable_unfollow",
      params: [paraSubscriptionId],
    });
    await unsubscribedPara;

    await para.release();

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
