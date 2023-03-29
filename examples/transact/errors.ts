// import { alice, bob } from "capi"
// import { signature } from "capi/patterns/signature/polkadot.ts"
// import { Balances, chain } from "westend_dev/mod.ts"
// import { assertRejects } from "../deps/std/testing/asserts.ts"

// assertRejects(() =>
//   Balances
//     .transfer({
//       value: 1_000_000_000_000_000_000_000_000_000_000_000_000n,
//       dest: bob.address,
//     })
//     .signed(signature(chain, { sender: alice }))
//     .sent()
//     .dbgStatus()
//     .finalizedEvents()
//     .unhandleFailed()
//     .run()
// )
