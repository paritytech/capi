import { AddressRune, alice } from "capi"
import {
  InkMetadataRune,
  instantiationEventIntoPublicKey,
  isInstantiatedEvent,
} from "capi/patterns/ink/mod.ts"
import { client } from "zombienet/rococo_contracts.toml/collator/@latest/mod.ts"
import { parse } from "../../deps/std/flags.ts"

export const metadata = InkMetadataRune.from(
  client,
  Deno.readTextFileSync("examples/ink_e2e/metadata.json"),
)

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
    .logStatus("Contract deployment status:")
    .txEvents()
    .map((events) =>
      events.find(isInstantiatedEvent) ?? new FailedToFindContractInstantiatedError()
    )
    .unhandle(FailedToFindContractInstantiatedError)
    .pipe(instantiationEventIntoPublicKey)
    .address(client)
    .run()
}
console.log(`Contract address: ${address}`)

const publicKey = AddressRune.from(client, address).publicKey()
console.log("Contract public key:", await publicKey.run())

const contract = metadata.instance(client, publicKey)

console.log("Get:", await contract.call({ sender, method: "get" }).run())

console.log(
  await contract
    .tx({ sender, method: "flip" })
    .signed({ sender: alice })
    .sent()
    .logStatus("Flip status:")
    .txEvents()
    .pipe(contract.filterContractEvents)
    .run(),
)

console.log("Get:", await contract.call({ sender, method: "get" }).run())
