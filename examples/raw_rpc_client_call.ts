import * as T from "#capi/test_util/mod.ts"

const client = await T.westend.client

console.log(await client.call(client.providerRef.nextId(), "state_getMetadata", []))

await client.discard()
