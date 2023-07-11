/**
 * @title Interact With An Ink Smart Contract
 * @description The Ink patterns simplify the reading of contract instance state and events,
 * as well as the submission of transactions.
 * @note we intend to work on an Ink provider (for static codegen) in the near future.
 * This work will likely entail large changes to the current ink patterns.
 */

import { $accountId32, contractsDev } from "@capi/contracts-dev"
import { assert } from "asserts"
import { $, createDevUsers, hex } from "capi"
import { signature } from "capi/patterns/signature/polkadot"
import { InkMetadataRune } from "capi/patterns/unstable/ink"

/// Get two test users. Alexa will deploy, Billy will be the recipient of an erc20
/// token transfer.
const { alexa, billy } = await createDevUsers()

/// If no such argument was supplied, run the `deploy.ts` script and extract
/// the address from the `CONTRACT_ADDRESS` environment variable (set by `deploy.ts`).
Deno.env.set("DEPLOYER_SECRET", hex.encode(alexa.secretKey))
await import("./deploy.eg.ts")
const address = Deno.env.get("CONTRACT_SS58_ADDRESS")!

/// Initialize an `InkMetadataRune` with the raw Ink metadata text.
const metadata = InkMetadataRune.fromMetadataText(
  Deno.readTextFileSync(new URL("./erc20.json", import.meta.url)),
)

/// Initialize an `InkRune` with `metadata`, `chain` and the deployed contract address.
const contract = metadata.instanceFromSs58(contractsDev, address)

const state = contract.call({
  sender: alexa.publicKey,
  method: "balance_of",
  args: [alexa.publicKey],
})

/// Retrieve the initial state.
const initialState = await state.run()
$.assert($.u64, initialState)
console.log("Alexa initial balance:", initialState)

/// Use the `flip` method to *flip* the contract instance state.
const events = await contract
  .tx({
    sender: alexa.publicKey,
    method: "transfer",
    args: [billy.publicKey, 1_000n],
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Transfer:")
  .inBlockEvents("Contracts", "ContractEmitted")
  .pipe(contract.decodeEvents)
  .run()

/// Ensure the emitted events are of the expected shape.
/// In this case, we expect only a `Transfer` event.
$.assert(
  $.array($.taggedUnion("type", [
    $.variant(
      "Transfer",
      $.field("from", $accountId32),
      $.field("to", $accountId32),
      $.field("value", $.u128),
    ),
  ])),
  events,
)
console.log(events)

/// Retrieve the final state.
const finalState = await state.run()
$.assert($.u64, finalState)
console.log("Alexa final balance:", finalState)

assert(finalState < initialState)
