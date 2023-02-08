import { AddressRune, alice } from "capi"
import { ink } from "capi/patterns"
import { client } from "zombienet/examples/ink_e2e/zombienet.toml/collator/@latest/mod.ts"
import { parse } from "../../deps/std/flags.ts"

export const contract = ink.InkMetadataRune.from(
  client,
  Deno.readTextFileSync("examples/ink_e2e/metadata.json"),
)

const sender = alice.publicKey

let { address } = parse(Deno.args, { string: ["address"] })
if (!address) {
  class FailedToFindContractInstantiatedError extends Error {
    override readonly name = "FailedToFindContractAddressError"
  }

  address = await contract
    .instantiate({
      sender,
      code: Deno.readFileSync("examples/ink_e2e/code.wasm"),
    })
    .signed({ sender: alice })
    .sent()
    .logStatus("Contract deployment status:")
    .txEvents()
    .map((events) =>
      events.find(ink.isInstantiatedEvent) ?? new FailedToFindContractInstantiatedError()
    )
    .unhandle(FailedToFindContractInstantiatedError)
    .pipe(ink.instantiationEventIntoPublicKey)
    .address(client)
    .run()
}
console.log(`Contract address: ${address}`)

const publicKey = AddressRune.from(address, client).publicKey()
console.log("Contract public key:", await publicKey.run())

const instance = contract.instance(client, publicKey)

console.log("Get:", await instance.call({ sender, method: "get" }).run())

console.log(
  await instance
    .tx({ sender, method: "flip" })
    .signed({ sender: alice })
    .sent()
    .logStatus("Flip status:")
    .txEvents()
    .pipe(instance.filterContractEvents)
    .run(),
)

console.log("Get:", await instance.call({ sender, method: "get" }).run())
