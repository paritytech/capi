/**
 * @title Polkadot-JS Signature Compatibility
 * @stability nearing
 * @description Utilize a Polkadot-JS signer (such as from a browser wallet
 * extension) to sign a Capi extrinsic.
 */

import { polkadotDev } from "@capi/polkadot-dev"
import { createDevUsers, ss58 } from "capi"
import { pjsSender, PjsSigner } from "capi/patterns/compat/pjs_sender.ts"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { createPair } from "https://deno.land/x/polkadot@0.2.38/keyring/mod.ts"
import { TypeRegistry } from "https://deno.land/x/polkadot@0.2.38/types/mod.ts"

const { alexa, billy } = await createDevUsers()

/// Here, we manually create a signer. Chances are that **you should not do this**.
/// Instead, it's likely that you'll want to access a signer from a wallet browser
/// extension such as Talisman or Polkadot-js. For instance:
///
/// ```ts
/// const pjsSigner = (await web3FromSource("polkadot-js")).signer!;
/// ```
const pjsSigner: PjsSigner = {
  signPayload(payload) {
    const tr = new TypeRegistry()
    tr.setSignedExtensions(payload.signedExtensions)
    return Promise.resolve(
      tr.createType("ExtrinsicPayload", payload, { version: payload.version })
        .sign(createPair({ toSS58: () => alexaSs58, type: "sr25519" }, alexa)),
    )
  },
}

/// The signer is usually accompanied by the ss58 address (aka. provided by the
/// extension). In our case––since we manually create the signer––we'll also manually
/// create the associated ss58 (by applying the prefix and Alexa's public key to
/// Capi's `ss58.encode` util).
const alexaSs58 = ss58.encode(polkadotDev.System.SS58Prefix, alexa.publicKey)

/// Use the `chain` and signer to create a `sender` factory, which accepts an Ss58
/// address and returns the `ExtrinsicSender`.
const sender = pjsSender(polkadotDev, pjsSigner)

/// Sign and send the transfer with the pjs compat `sender` factory and Alexa's Ss58.
await polkadotDev.Balances
  .transfer({
    value: 12345n,
    dest: billy.address,
  })
  .signed(signature({ sender: sender(alexaSs58) }))
  .sent()
  .dbgStatus("Transfer:")
  .finalizedEvents()
  .unhandleFailed()
  .run()
