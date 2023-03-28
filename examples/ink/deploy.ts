import { AccountIdRune, alice, ValueRune } from "capi"
import { InkMetadataRune, isInstantiatedEvent } from "capi/patterns/ink/mod.ts"
import { chain } from "contracts_dev/mod.js"
import { signature } from "../../patterns/signature/polkadot.ts"

class FailedToInstantiateError extends Error {
  override readonly name = "FailedToInstantiateError"
}

const metadataText = Deno.readTextFileSync(new URL(import.meta.resolve("./metadata.json")))
const metadata = InkMetadataRune.fromMetadataText(metadataText)

const accountId = await metadata
  .instantiate(chain, {
    sender: alice.publicKey,
    code: Deno.readFileSync(new URL("./code.wasm", import.meta.url)),
  })
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Contract deployment status:")
  .inBlockEvents()
  .into(ValueRune)
  .map((events) => events.find(isInstantiatedEvent) ?? new FailedToInstantiateError())
  .unhandle(FailedToInstantiateError)
  .access("event", "value", "contract")
  .unsafeAs<Uint8Array>() // TODO: implicitly narrow
  .into(AccountIdRune)
  .ss58(chain)
  .run()

console.log(`Contract address: ${accountId}`)
Deno.env.set("CONTRACT_ADDRESS", accountId)
