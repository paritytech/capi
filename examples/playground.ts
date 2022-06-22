import { assert } from "../_deps/asserts.ts";
import { KnownRpcMethods } from "../known/mod.ts";
import * as C from "../rpc/mod.ts";

const client = await C.executableClient<KnownRpcMethods>({
  bin: "./node-template",
  port: 8000,
  cwd: new URL("../test", import.meta.url).pathname,
});
console.log({ client });
assert(!(client instanceof Error));
const result = await client.call("state_getMetadata", []);
console.log({ result });
await client.close();
