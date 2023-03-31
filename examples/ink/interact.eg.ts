/**
 * @title Interact With An Ink Smart Contract
 * @stability unstable – We intend to work on an Ink provider (for static codegen)
 * in the near future. This work will likely entail large changes to the current ink patterns.
 *
 * The Ink patterns simplify the reading of contract instance state and events, as well as
 * the submission of transactions.
 */

import { assertNotEquals } from "asserts"
import { alice } from "capi"
import { InkMetadataRune } from "capi/patterns/ink/mod.ts"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { chain } from "contracts_dev/mod.js"
import { parse } from "../../deps/std/flags.ts"

// Attempt to read contract address from command line argument (optional)
let { address } = parse(Deno.args, { string: ["address"] })

// If no such argument was supplied, run the `deploy.ts` script and extract
// the address from the `CONTRACT_ADDRESS` environment variable (set by `deploy.ts`).
if (!address) {
  await import("./deploy.eg.ts")
  address = Deno.env.get("CONTRACT_ADDRESS")!
}

// Initialize an `InkMetadataRune` with the raw Ink metadata text.
export const metadata = InkMetadataRune.fromMetadataText(
  Deno.readTextFileSync(new URL("./metadata.json", import.meta.url)),
)

// Initialize an `InkRune` with `metadata`, `chain` and the deployed contract address.
const contract = metadata.instanceFromSs58(chain, address)

const state = contract.call({
  sender: alice.publicKey,
  method: "get",
})

// Retrieve the initial state.
const initialState = await state.run()

// Use the `flip` method to *flip* the contract instance state.
await contract
  .tx({
    sender: alice.publicKey,
    method: "flip",
  })
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Flip:")
  .inBlockEvents()
  .pipe(contract.filterContractEvents)
  .run()

// Retrieve the final state.
const finalState = await state.run()

assertNotEquals(initialState, finalState)
