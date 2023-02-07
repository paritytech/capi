import { AddressRune, alice } from "capi"
import { ink } from "capi/patterns"
import { client } from "zombienet/examples/ink_e2e/zombienet.toml/collator/@latest/mod.ts"
import { parse } from "../../deps/std/flags.ts"

export const contract = ink.InkMetadataRune.from(
  client,
  Deno.readTextFileSync("examples/ink_e2e/metadata.json"),
)

let { address } = parse(Deno.args, { string: ["address"] })
if (!address) {
  address = await contract
    .instantiate({
      origin: alice.publicKey,
      code: Deno.readFileSync("examples/ink_e2e/code.wasm"),
    })
    .signed({ sender: alice })
    .sent()
    .logStatus("Contract deployment status:")
    .events()
    .pipe(ink.findResultEvent)
    .pipe(ink.resultEventIntoPublicKey)
    .address(client)
    .run()
}
console.log(`Contract address: ${address}`)

const publicKey = AddressRune.from(address, client).publicKey()
console.log("Contract public key:", await publicKey.run())

const instance = contract.instance(client, publicKey)

const read0 = instance
  .msg({
    sender: alice.publicKey,
    method: "get",
  })
  .run()
console.log(await read0)

// TODO: what values do we want?
// console.log(".get", await instance.msg("get").run())
// console.log(".flip", await instance.msg("flip").signed({ sender: alice }).run())
// console.log(".get", await instance.msg("get").run())
// console.log(".get_count", await instance.msg("get_count").run())
// console.log(".inc", await instance.msg("inc").signed({ sender: alice }).run())
// console.log(".inc", await instance.msg("inc").signed({ sender: alice }).run())
// console.log(".get_count", await instance.msg("get_count").signed({ sender: alice }).run())
// console.log(
//   ".inc_by(3)",
//   await instance.msg("inc_by", 3).signed({ sender: alice }).run(),
// )
// console.log(".get_count", await instance.msg("get_count").run())
// console.log(
//   ".inc_by_with_event(3) contract events",
//   await instance.msg("inc_by_with_event", 3).signed({ sender: alice }).run(),
// )
// console.log(
//   ".method_returning_tuple(2,true)",
//   await instance.msg("method_returning_tuple", 2, true).signed({ sender: alice }).run(),
// )
// console.log(
//   ".method_returning_struct(3,false)",
//   await instance.msg("method_returning_struct", 3, false).signed({ sender: alice }).run(),
// )
