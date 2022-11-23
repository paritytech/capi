import * as T from "http://localhost:5646/@local/test_util/mod.ts"

const client = await T.westend.client

console.log(await client.call(client.providerRef.nextId(), "state_getMetadata", []))

await client.discard()
