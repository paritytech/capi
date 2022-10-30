import { polkadot } from "../test_util/config.ts";
import { state } from "./known.ts";
import { Client, proxyProvider } from "./mod.ts";

const client = new Client(proxyProvider, await polkadot.initDiscoveryValue());

const metadata = await state.getMetadata()(client);

if (metadata instanceof Error) {
  throw metadata;
} else if (metadata.error) {
  console.error(metadata.error);
} else {
  console.log(metadata.result);
}

await client.discard();
