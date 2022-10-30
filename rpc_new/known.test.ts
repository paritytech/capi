import { config } from "../test_util/config/polkadot.ts";
import { state } from "./known.ts";
import { Client, proxyProvider } from "./mod.ts";

const client = new Client(proxyProvider, await config.initDiscoveryValue());

const metadata = await state.getMetadata()(client);

console.log(metadata);

await client.close();
