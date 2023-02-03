import { alice, InkContractRune, Rune } from "capi/mod.ts"
import { client } from "zombienet/examples/ink_contract/zombienet.toml/collator01/@latest/mod.ts"

const contract = Rune
  .resolve(Deno.readTextFileSync("examples/ink_contract/metadata.json"))
  .as(InkContractRune, client)

await contract
  .instantiate({
    code: Deno.readFileSync("examples/ink_contract/flipper.wasm"),
    initiator: alice.publicKey,
  })
  .signed({ sender: alice })
  .sent()
  .logStatus()
  .address()
// .run()

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
