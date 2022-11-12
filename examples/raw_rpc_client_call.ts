import * as T from "../test_util/mod.ts"

const client = await T.westend.client

console.log(
  await client.call({
    jsonrpc: "2.0",
    id: client.providerRef.nextId(),
    method: "state_getMetadata",
    params: [],
  }),
)

await client.discard()
