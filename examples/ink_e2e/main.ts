import { AddressRune, alice } from "capi"
import { ink } from "capi/patterns"
import { client } from "zombienet/examples/ink_e2e/zombienet.toml/collator/@latest/mod.ts"
import { parse } from "../../deps/std/flags.ts"

export const contract = ink.InkMetadataRune.from(
  client,
  Deno.readTextFileSync("examples/ink_e2e/metadata.json"),
)

const origin = alice.publicKey

let { address } = parse(Deno.args, { string: ["address"] })
if (!address) {
  address = await contract
    .instantiate({
      origin,
      code: Deno.readFileSync("examples/ink_e2e/code.wasm"),
    })
    .signed({ sender: alice })
    .sent()
    .logStatus("Contract deployment status:")
    .events()
    .pipe(ink.eventsIntoPublicKey)
    .address(client)
    .run()
}
console.log(`Contract address: ${address}`)

const publicKey = AddressRune.from(address, client).publicKey()
console.log("Contract public key:", await publicKey.run())

const instance = contract.instance(client, publicKey)

console.log("Get:", await instance.call({ origin, method: "get" }).run())

await instance
  .tx({ origin, method: "flip" })
  .signed({ sender: alice })
  .sent()
  .logStatus("Flip status:")
  .finalized()
  .run()

console.log("Get:", await instance.call({ origin, method: "get" }).run())
