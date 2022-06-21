import { assert } from "../_deps/asserts.ts";
import { KnownRpcMethods } from "../known/mod.ts";
import * as C from "../rpc/mod.ts";

const client = await C.ExecutableClient.open<KnownRpcMethods>({
  cmd: ["./node-template", "--tmp"],
  discoveryValue: "wss://localhost:127.0.0.1:9933",
  cwd: new URL("../test", import.meta.url).pathname,
});
assert(!(client instanceof Error));
const result = await client.call("state_getMetadata", []);
console.log({ result });
await client.close();
