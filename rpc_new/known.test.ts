import { polkadot } from "../test_util/config.ts";
import { state } from "./known.ts";
import { Client, proxyProvider } from "./mod.ts";

const client = new Client(proxyProvider, await polkadot.initDiscoveryValue());

const metadata = await state.getMetadata()(client);

console.log(metadata);

await client.discard();
