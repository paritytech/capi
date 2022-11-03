import * as C from "../../mod.ts";
import * as T from "../../test_util/mod.ts";

const client = new C.rpc.Client(C.rpc.proxyProvider, await T.westend.url);

console.log(
  await client.call({
    jsonrpc: "2.0",
    id: client.providerRef.nextId(),
    method: "state_getMetadata",
    params: [],
  }),
);

await client.discard();
