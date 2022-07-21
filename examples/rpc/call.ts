import { assert } from "../../_deps/std/testing/asserts.ts";
import { polkadot } from "../../known/mod.ts";
import * as rpc from "../../rpc/mod.ts";

const client = await rpc.fromConfig(polkadot);
assert(!(client instanceof Error));
const result = await client.call("state_getMetadata", []);
console.log(result);
await client.close();
