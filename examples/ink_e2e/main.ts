import { alice } from "capi"
import { ink } from "capi/patterns"
import { client } from "zombienet/examples/ink_e2e/zombienet.toml/collator/@latest/mod.ts"

const contract = ink.ContractRune.from(
  client,
  Deno.readTextFileSync("examples/ink_e2e/metadata.json"),
)

const address = await contract
  .instantiate({
    origin: alice.publicKey,
    code: Deno.readFileSync("examples/ink_e2e/code.wasm"),
  })
  .signed({ sender: alice })
  .sent()
  .logStatus()
  .address()
  .run()

console.log(address)

// if (resultEvent.event.type === "System") {
//   console.log((await ink.decodeError(client, resultEvent as any).run()).event.value.dispatchError)
// }

// console.log(resultEvent)

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
