import { AddressRune, alice, Rune, ValueRune } from "capi"
import {
  InkMetadataRune,
  instantiationEventIntoPublicKey,
  isInstantiatedEvent,
  parse as parseMetadata,
} from "capi/patterns/ink/mod.ts"
import { chain } from "contracts_dev/mod.ts"
import { parse } from "../../deps/std/flags.ts"

export const metadata = Rune
  .resolve(parseMetadata(Deno.readTextFileSync("examples/ink_e2e/metadata.json")))
  .into(InkMetadataRune, chain)

const sender = alice.publicKey

let { address } = parse(Deno.args, { string: ["address"] })
if (!address) {
  class FailedToFindContractInstantiatedError extends Error {
    override readonly name = "FailedToFindContractInstantiatedError"
  }

  address = await metadata
    .instantiate({
      sender,
      code: Deno.readFileSync("examples/ink_e2e/code.wasm"),
    })
    .signed({ sender: alice })
    .sent()
    .dbgStatus("Contract deployment status:")
    .inBlockEvents()
    .into(ValueRune)
    .map((events) =>
      events.find(isInstantiatedEvent) ?? new FailedToFindContractInstantiatedError()
    )
    .unhandle(FailedToFindContractInstantiatedError)
    .pipe(instantiationEventIntoPublicKey)
    .address(chain)
    .run()
}
console.log(`Contract address: ${address}`)

const publicKey = Rune.resolve(address).into(AddressRune, chain).publicKey()
console.log("Contract public key:", await publicKey.run())

const contract = metadata.instance(chain, publicKey)

console.log("Get:", await contract.call({ sender, method: "get" }).run())

console.log(
  await contract
    .tx({ sender, method: "flip" })
    .signed({ sender: alice })
    .sent()
    .dbgStatus("Flip status:")
    .inBlockEvents()
    .pipe(contract.filterContractEvents)
    .run(),
)

console.log("Get:", await contract.call({ sender, method: "get" }).run())
