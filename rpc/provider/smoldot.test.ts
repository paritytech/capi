// TODO
import { assertExists, assertNotInstanceOf } from "../../deps/std/testing/asserts.ts";
import { NotificationMessage } from "../messages.ts";
import { nextIdFactory } from "./base.ts";
import { WellKnownChain } from "./smoldot-types.ts";
import { smoldotClient } from "./smoldot.ts";

const nextId = nextIdFactory();
const POLKADOT_CHAIN_SPEC_URL =
  "https://raw.githubusercontent.com/paritytech/substrate-connect/main/packages/connect/src/connector/specs/polkadot.json";

const PARACHAIN_SPEC_URL =
  "https://raw.githubusercontent.com/paritytech/substrate-connect/main/projects/demo/src/assets/westend-westmint.json";

Deno.test("Smoldot tests", async (t) => {
  // get a "random" (we chose polkadot) spec file
  const polkadotChainSpec = await (await fetch(POLKADOT_CHAIN_SPEC_URL)).text();

  // Start smoldotClient
  const client = smoldotClient({ maxLogLevel: 3 });

  await t.step({
    name: "Smoldot AddChain",
    ignore: false,
    async fn() {
      // Start the timer and the Smoldot Client for all tests
      // 10 seconds should be enough for smoldot to sync
      let timer = 0;
      const promisedTimer = new Promise((resolve) => {
        timer = setTimeout(resolve, 10000);
      });

      const chainListener = (message: any) => {
        // check if smoldot is initialized so we can stop doing stuff
        if ((JSON.parse(message) as NotificationMessage).params?.result?.event === "initialized") {
          assertNotInstanceOf(message, Error);
          assertExists((JSON.parse(message) as NotificationMessage).params.result.event);
          console.log("<<<<==== Tests run. Timer sucks ====>>>>");
        }
      };

      const chain = client.addChain(polkadotChainSpec, chainListener);

      const reqJson = {
        jsonrpc: "2.0",
        id: nextId(),
        method: "chainHead_unstable_follow",
        params: [true],
      };

      // "Listen" to the messages
      (await chain).sendJsonRpc(JSON.stringify(reqJson));

      // Wait for 10 seconds before shutting down everyting
      await promisedTimer;
      // Remove the chain that was added in this step
      (await chain).remove();
      clearTimeout(timer);
    },
  });

  await t.step({
    name: "Smoldot Add WellknownChain",
    ignore: false,
    async fn() {
      // Start the timer and the Smoldot Client for all tests
      // 10 seconds should be enough for smoldot to sync
      let timer = 0;
      const promisedTimer = new Promise((resolve) => {
        timer = setTimeout(resolve, 10000);
      });
      const chainListener = (message: any) => {
        // check if smoldot is initialized so we can stop doing stuff
        if ((JSON.parse(message) as NotificationMessage).params?.result?.event === "initialized") {
          assertNotInstanceOf(message, Error);
          assertExists((JSON.parse(message) as NotificationMessage).params.result.event);
          console.log("<<<<==== Tests run. Timer sucks ====>>>>");
        }
      };

      // We do not get a random spec but a "WellKnownChain" one (e.g. westend)
      const chain = client.addWellKnownChain(WellKnownChain.westend2, chainListener);
      const reqJson = {
        jsonrpc: "2.0",
        id: nextId(),
        method: "chainHead_unstable_follow",
        params: [true],
      };

      // "Listen" to the messages
      (await chain).sendJsonRpc(JSON.stringify(reqJson));

      // Wait for 10 seconds before shutting down everyting
      await promisedTimer;
      // Remove the chain that was added in this step
      (await chain).remove();
      clearTimeout(timer);
    },
  });

  await t.step({
    name: "Smoldot Add Relay Chain and Parachain",
    ignore: false,
    async fn() {
      // Start the timer and the Smoldot Client for all tests
      // 10 seconds should be enough for smoldot to sync
      let relayTimer = 0;
      const promisedRelayTimer = new Promise((resolve) => {
        relayTimer = setTimeout(resolve, 10000);
      });
      let parachainTimer = 0;

      const promisedParachainTimer = new Promise((resolve) => {
        parachainTimer = setTimeout(resolve, 30000);
      });

      const paraChainSpec = await (await fetch(PARACHAIN_SPEC_URL)).text();

      const chainListener = (message: any) => {
        // check if smoldot is initialized so we can stop doing stuff
        if ((JSON.parse(message) as NotificationMessage).params?.result?.event === "initialized") {
          assertNotInstanceOf(message, Error);
          assertExists((JSON.parse(message) as NotificationMessage).params.result.event);
          console.log("<<<<==== Tests run. Timer sucks ====>>>>");
        }
      };

      // We do not get a random spec but a "WellKnownChain" one (e.g. westend)
      const relayChain = client.addWellKnownChain(WellKnownChain.westend2, () => {});

      await promisedRelayTimer;
      clearTimeout(relayTimer);

      const paraChain = client.addChain(paraChainSpec, chainListener);
      const reqJson = {
        jsonrpc: "2.0",
        id: nextId(),
        method: "chainHead_unstable_follow",
        params: [true],
      };

      // "Listen" to the messages
      (await paraChain).sendJsonRpc(JSON.stringify(reqJson));

      // Wait for 10 seconds before shutting down everyting
      await promisedParachainTimer;

      // Remove the chain that was added in this step
      (await relayChain).remove();
      (await paraChain).remove();
      clearTimeout(parachainTimer);
    },
  });

  console.log(
    "=============== Chain removed - test should stop here somehow instead of Failing",
  );
});
