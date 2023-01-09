import { client } from "westend_dev/_/client/raw.ts"

console.log(await client.call(client.providerRef.nextId(), "state_getMetadata", []))

await client.discard()
