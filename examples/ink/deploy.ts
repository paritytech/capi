/**
 * @title Deploy an Ink Smart Contract
 * @stability unstable – We intend to work on an Ink provider (for static codegen)
 * in the near future. This work will likely entail large changes to the current ink patterns.
 *
 * Deploying an Ink contract (instantiating) to a production contracts-enabled parachain
 * is much the same as any other extrinsic submission.
 */

import { $, alice, ss58 } from "capi"
import { InkMetadataRune, isInstantiatedEvent } from "capi/patterns/ink/mod.ts"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { chain, System } from "contracts_dev/mod.js"

// Initialize an `InkMetadataRune` with the raw Ink metadata text.
const metadata = InkMetadataRune.fromMetadataText(
  Deno.readTextFileSync(new URL(import.meta.resolve("./metadata.json"))),
)

// Instantiate `code.wasm` with `alice` and––upon block inclusion––return the
// list of system events specific to this instantiation.
const events = await metadata
  .instantiation(chain, {
    sender: alice.publicKey,
    code: Deno.readFileSync(new URL("./code.wasm", import.meta.url)),
  })
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Contract instantiation:")
  .inBlockEvents()
  .run()

// > Note: we're using `inBlockEvents` and not `finalizedEvents` because our provider
// > is configured with instant finality. This is optimal for testing, but not production.

// Find the event corresponding to instantiation, and extract the instance's `accountId`.
// We'll convert this to an Ss58 address and place it within an environment variable. This
// way we can easy deploy from other scripts with a simple `await import("./deploy.ts")`.
for (const event of events) {
  if (isInstantiatedEvent(event)) {
    const accountId = event.event.value.contract
    $.assert($.sizedUint8Array(32), accountId)
    const address = ss58.encode(System.SS58Prefix, accountId)
    console.log(`Deployed as ${address}`)
    Deno.env.set("CONTRACT_ADDRESS", address)
    break
  }
}
