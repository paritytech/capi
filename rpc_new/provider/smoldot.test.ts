// TODO
import { deferred } from "../../deps/std/async.ts";
import { assertExists, assertNotInstanceOf } from "../../deps/std/testing/asserts.ts";
import { smoldotProvider } from "./smoldot.ts";

const POLKADOT_CHAIN_SPEC_URL =
  "https://raw.githubusercontent.com/paritytech/substrate-connect/main/packages/connect/src/connector/specs/polkadot.json";

Deno.test({
  name: "Smoldot Provider",
  ignore: true,
  async fn() {
    const stopped = deferred();
    const polkadotChainSpec = await (await fetch(POLKADOT_CHAIN_SPEC_URL)).text();
    const provider = smoldotProvider(polkadotChainSpec, (message) => {
      assertNotInstanceOf(message, Error);
      assertExists(message.result);
      console.log(message);
      stopped.resolve();
    });
    provider.send({
      jsonrpc: "2.0",
      id: provider.nextId(),
      method: "system_health",
      params: [],
    });

    await stopped;
    await provider.release();
  },
});
