import {
  client,
} from "capi/frame/zombienet/examples/ink_contract/zombienet.toml/collator01/@v0.9.360/mod.ts"
import { alice } from "capi/mod.ts"

const contract = client.inkContract({
  metadataRaw: Deno.readTextFileSync("examples/ink_contract/metadata.json"),
})

const hash = await contract
  .instantiate({
    code: Deno.readFileSync("examples/ink_contract/flipper.wasm"),
    initiator: alice.publicKey,
  })
  .signed({ sender: alice })
  .sent()
  .logEvents()
  .finalized()
  .unwrapError()
  .run()

console.log(hash)

// class ExtrinsicFailed extends Error {
//   override readonly name = "ExtrinsicFailedError"
//   constructor(
//     override readonly cause: {
//       event?: Record<string, any>
//       phase: { value: number }
//     },
//   ) {
//     super()
//   }
// }

// const tx = C.contracts.instantiate(client)({
//   code,
//   constructorMetadata,
//   salt,
//   sender: C.alice.address,
// }).signed(C.alice.sign)
// const finalizedIn = tx.watch(({ end }) => (status) => {
//   console.log(status)
//   if (typeof status !== "string" && (status.inBlock ?? status.finalized)) {
//     return end(status.inBlock ?? status.finalized)
//   } else if (C.rpc.known.TransactionStatus.isTerminal(status)) {
//     return end(new Error())
//   }
//   return
// })
// const contractAddress = C.throwIfError(
//   await C
//     .events(tx, finalizedIn)
//     .next((events) => {
//       const extrinsicFailedEvent = events.find((e) =>
//         e.event?.type === "System" && e.event?.value?.type === "ExtrinsicFailed"
//       )
//       if (extrinsicFailedEvent) {
//         return new ExtrinsicFailed(extrinsicFailedEvent)
//       }
//       const event = events.find((e) =>
//         e.event?.type === "Contracts" && e.event?.value?.type === "Instantiated"
//       )
//       return event?.event?.value.contract as Uint8Array
//     })
//     .run(),
// )

// const prefix = C.throwIfError(await C.const(client)("System", "SS58Prefix").access("value").run())
// console.log("Deployed Contract address", C.ss58.encode(prefix, contractAddress))

// const flipperContract = new C.fluent.Contract(client, metadata, contractAddress)
// console.log(
//   ".get",
//   await flipperContract.call({
//     sender: C.alice.address,
//     messageLabel: "get",
//     args: [],
//   }).run(),
// )
// console.log(
//   "block hash and events",
//   C.throwIfError(
//     await flipperContract.callTx({
//       sender: C.alice.address,
//       args: [],
//       sign: C.alice.sign,
//       messageLabel: "flip",
//     }).run(),
//   )[0],
// )
// console.log(
//   ".get",
//   await flipperContract.call({
//     sender: C.alice.address,
//     messageLabel: "get",
//     args: [],
//   }).run(),
// )
// console.log(
//   ".get_count",
//   await flipperContract.call({ sender: C.alice.address, messageLabel: "get_count", args: [] })
//     .run(),
// )
// console.log(
//   ".inc block hash",
//   C.throwIfError(
//     await flipperContract.callTx({
//       sender: C.alice.address,
//       messageLabel: "inc",
//       args: [],
//       sign: C.alice.sign,
//     }).run(),
//   )[0],
// )
// console.log(
//   ".inc block hash",
//   C.throwIfError(
//     await flipperContract.callTx({
//       sender: C.alice.address,
//       messageLabel: "inc",
//       args: [],
//       sign: C.alice.sign,
//     }).run(),
//   )[0],
// )
// console.log(
//   ".get_count",
//   await flipperContract.call({ sender: C.alice.address, messageLabel: "get_count", args: [] })
//     .run(),
// )
// console.log(
//   ".inc_by(3) block hash",
//   C.throwIfError(
//     await flipperContract.callTx({
//       sender: C.alice.address,
//       messageLabel: "inc_by",
//       args: [3],
//       sign: C.alice.sign,
//     }).run(),
//   )[0],
// )
// console.log(
//   ".get_count",
//   await flipperContract.call({ sender: C.alice.address, messageLabel: "get_count", args: [] })
//     .run(),
// )
// console.log(
//   ".inc_by_with_event(3) contract events",
//   C.throwIfError(
//     await flipperContract.callTx({
//       sender: C.alice.address,
//       messageLabel: "inc_by_with_event",
//       args: [3],
//       sign: C.alice.sign,
//     }).run(),
//   )[2],
// )
// console.log(
//   ".method_returning_tuple(2,true)",
//   await flipperContract.call({
//     sender: C.alice.address,
//     messageLabel: "method_returning_tuple",
//     args: [2, true],
//   }).run(),
// )
// console.log(
//   ".method_returning_struct(3,false)",
//   await flipperContract.call({
//     sender: C.alice.address,
//     messageLabel: "method_returning_struct",
//     args: [3, false],
//   }).run(),
// )
