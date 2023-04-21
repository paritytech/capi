/**
 * @title Deploy an Ink Smart Contract
 * @stability unstable – We intend to work on an Ink provider (for static codegen)
 * in the near future. This work will likely entail large changes to the current ink patterns.
 * @description Deploying an Ink contract (instantiating) to a production contracts-enabled parachain
 * is much the same as any other extrinsic submission.
 */

import { ContractsDev } from "@capi/contracts-dev"
import { $, createDevUsers, hex, Sr25519, ss58 } from "capi"
import { InkMetadataRune } from "capi/patterns/ink/mod.ts"
import { signature } from "capi/patterns/signature/polkadot.ts"

/// Initialize an `InkMetadataRune` with the raw Ink metadata text.
const metadata = InkMetadataRune.fromMetadataText(
  Deno.readTextFileSync(new URL(import.meta.resolve("./erc20.json"))),
)

/// Given that other examples may utilize this script, we'll allow the
/// contract deployer to be optionally specified via an environment variable.
/// In the case that it's not specified, we'll create a new test user.
const senderSecret = Deno.env.get("DEPLOYER_SECRET")
const sender = senderSecret
  ? Sr25519.fromSecret(hex.decode(senderSecret))
  : (await createDevUsers(1))[0]

/// Instantiate `code.wasm` with `alice` and––upon block inclusion––return the
/// list of system events specific to this instantiation.
const events = await metadata
  .instantiation(ContractsDev, {
    sender: sender.publicKey,
    code: Deno.readFileSync(new URL("./erc20.wasm", import.meta.url)),
    args: [1_000_000n],
  })
  .signed(signature({ sender }))
  .sent()
  .dbgStatus("Instantiation:")
  .inBlockEvents()
  .run()

/// > Note: we're using `inBlockEvents` and not `finalizedEvents` because our provider
/// > is configured with instant finality. This is optimal for testing, but not production.

/// Find the event corresponding to instantiation, and extract the instance's `accountId`.
/// We'll convert this to an Ss58 address and place it within an environment variable. This
/// way we can easy deploy from other scripts with a simple `await import("./deploy.ts")`.
for (const { event } of events) {
  if (event.type === "Contracts" && event.value.type === "Instantiated") {
    const accountId = event.value.contract
    console.log("Account id:", accountId)
    $.assert($.sizedUint8Array(32), accountId)
    const address = ss58.encode(ContractsDev.System.SS58Prefix, accountId)
    console.log("Contract ss58 address:", address)
    Deno.env.set("CONTRACT_SS58_ADDRESS", address)
    break
  }
}
