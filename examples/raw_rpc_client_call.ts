import { client } from "westend_dev/client/raw.ts"

console.log(await client.call(client.providerRef.nextId(), "state_getMetadata", []))

await client.discard()
