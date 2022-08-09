import { assert } from "../../deps/std/testing/asserts.ts";
import { polkadot } from "../../known/mod.ts";
import * as rpc from "../../rpc/mod.ts";

const client = await rpc.stdClient(polkadot);
assert(!(client instanceof Error));

console.log(await client.call("state_getMetadata", []));

await client.close();
