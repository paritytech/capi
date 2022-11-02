// TODO
import { smoldotProvider } from "./smoldot.ts";

const POLKADOT_CHAIN_SPEC_URL =
  "https://raw.githubusercontent.com/paritytech/smoldot/main/bin/polkadot.json";

Deno.test({
  name: "Proxy Provider",
  ignore: true,
  async fn() {
    const polkadotChainSpec = await (await fetch(POLKADOT_CHAIN_SPEC_URL)).text();
    const provider = smoldotProvider(polkadotChainSpec, (message) => {
      console.log(message);
      provider.release();
    });
    provider.send({
      jsonrpc: "2.0",
      id: provider.nextId(),
      method: "state_getMetadata",
      params: [],
    });
  },
});
