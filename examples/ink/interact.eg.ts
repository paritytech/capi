/**
 * @title Interact With An Ink Smart Contract
 * @stability unstable – We intend to work on an Ink provider (for static codegen)
 * in the near future. This work will likely entail large changes to the current ink patterns.
 * @description The Ink patterns simplify the reading of contract instance state and events,
 * as well as the submission of transactions.
 * @todo utilize `createDevUsers` instead of `alice` and `bob`.
 */

import { chain } from "@capi/contracts-dev"
import { assert } from "asserts"
import { $, alice, bob } from "capi"
import { InkMetadataRune } from "capi/patterns/ink/mod.ts"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { parse } from "../../deps/std/flags.ts"

// Attempt to read contract address from command line argument (optional)
let { address } = parse(Deno.args, { string: ["address"] })

// If no such argument was supplied, run the `deploy.ts` script and extract
// the address from the `CONTRACT_ADDRESS` environment variable (set by `deploy.ts`).
if (!address) {
  await import("./deploy.eg.ts")
  address = Deno.env.get("SS58_ADDRESS")!
}

// Initialize an `InkMetadataRune` with the raw Ink metadata text.
export const metadata = InkMetadataRune.fromMetadataText(
  Deno.readTextFileSync(new URL("./erc20.json", import.meta.url)),
)

// Initialize an `InkRune` with `metadata`, `chain` and the deployed contract address.
const contract = metadata.instanceFromSs58(chain, address)

const state = contract.call({
  sender: alice.publicKey,
  method: "balance_of",
  args: [alice.publicKey],
})

// Retrieve the initial state.
const initialState = await state.run()
console.log("Alice initial balance:", initialState)

// Use the `flip` method to *flip* the contract instance state.
const events = await contract
  .tx({
    sender: alice.publicKey,
    method: "transfer",
    args: [bob.publicKey, 1_000n],
  })
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Transfer:")
  .inBlockEvents()
  .pipe(contract.emittedEvents)
  .run()

// Ensure the emitted events are of the expected shape.
// In this case, we expect only a `Transfer` event.
$.assert(
  $.array($.taggedUnion("type", [
    $.variant(
      "Transfer",
      $.field("from", $.sizedUint8Array(32)),
      $.field("to", $.sizedUint8Array(32)),
      $.field("value", $.u128),
    ),
  ])),
  events,
)
console.log(events)

// Retrieve the final state.
const finalState = await state.run()
console.log("Alice final balance:", finalState)

assert(finalState < initialState)
