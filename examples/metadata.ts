import { assert } from "../_deps/asserts.ts";
import { polkadotBeacon } from "../known/mod.ts";
import * as C from "../mod.ts";
import { rpcClient } from "../rpc/mod.ts";

const client = await rpcClient(...polkadotBeacon);
assert(!(client instanceof Error));
const $metadata = C.metadata(client);
const result = await $metadata.run();
if (result instanceof Error) {
  throw result;
}
console.log(result);
await client.close();
