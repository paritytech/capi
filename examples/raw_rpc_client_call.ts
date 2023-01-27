import { rawClient } from "westend_dev/mod.ts"

console.log(await rawClient.call(rawClient.providerRef.nextId(), "state_getMetadata", []))

await rawClient.discard()
