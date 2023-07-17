/**
 * @title Deploy an Ink Smart Contract
 * @description Deploying an Ink contract (instantiating) to a production contracts-enabled
 * parachain is much the same as any other extrinsic submission.
 * @note We intend to work on an Ink provider (for static codegen) in the near future.
 * This work will likely entail large changes to the current ink patterns.
 */

import { $accountId32, contractsDev } from "@capi/contracts-dev"
import { $, createDevUsers, hex, Sr25519, ss58 } from "capi"
import { signature } from "capi/patterns/signature/polkadot"
import { InkMetadataRune } from "capi/patterns/unstable/ink"

/// Initialize an `InkMetadataRune` with the raw Ink metadata text.
const metadata = InkMetadataRune.fromMetadataText(
  Deno.readTextFileSync(new URL("./erc20.json", import.meta.url)),
)

/// Given that other examples may utilize this script, we'll allow the
/// contract deployer to be optionally specified via an environment variable.
/// In the case that it's not specified, we'll create a new test user.
const senderSecret = Deno.env.get("DEPLOYER_SECRET")
export const sender = senderSecret
  ? Sr25519.fromSecret(hex.decode(senderSecret))
  : (await createDevUsers(1))[0]

/// Instantiate `code.wasm` with `alice` and––upon block inclusion––return the
/// contract public key (inside of the instantiated event).
const accountId = await metadata
  .instantiation(contractsDev, {
    sender: sender.publicKey,
    code: Deno.readFileSync(new URL("./erc20.wasm", import.meta.url)),
    args: [1_000_000n],
  })
  .signed(signature({ sender }))
  .sent()
  .dbgStatus("Instantiation:")
  .inBlockEvents("Contracts", "Instantiated")
  .access(0, "event", "value", "contract")
  .run()

/// > Note: we're using `inBlockEvents` and not `finalizedEvents` because our provider
/// > is configured with instant finality. This is optimal for testing, but not production.

/// Ensure that the account ID is of the expected shape.
console.log("Account id:", accountId)
$.assert($accountId32, accountId)

/// We'll convert this to an Ss58 address and export it. This way we can easy
/// import the address of a deployed contract from other scripts.
export const contractAddress = ss58.encode(contractsDev.System.SS58Prefix, accountId)
console.log("Contract ss58 address:", contractAddress)
