import { assert } from "../../_deps/asserts.ts";
import { polkadotBeacon } from "../../known/mod.ts";
import * as rpc from "../../rpc/mod.ts";

const client = await rpc.proxyClient(polkadotBeacon);
assert(!(client instanceof Error));
const result = await client.call("state_getMetadata", []);
console.log(result);
await client.close();
