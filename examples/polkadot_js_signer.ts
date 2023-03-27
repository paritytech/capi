import { ss58 } from "capi"
import { pjsSender } from "capi/patterns/compat/pjs_sender.ts"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { createPair } from "https://deno.land/x/polkadot@0.2.25/keyring/mod.ts"
import { TypeRegistry } from "https://deno.land/x/polkadot@0.2.25/types/mod.ts"
import { Balances, chain, users } from "polkadot_dev/mod.js"

const [alexa, billy] = await users(2)

// Usually injected by an extension, e.g.
// const pjsSigner = (await web3FromSource("polkadot-js")).signer!;
const pjsSigner = {
  signPayload(payload: any) {
    const tr = new TypeRegistry()
    tr.setSignedExtensions(payload.signedExtensions)
    return Promise.resolve(
      tr.createType("ExtrinsicPayload", payload, { version: payload.version })
        .sign(createPair(
          { toSS58: () => alexaAddress, type: "sr25519" },
          alexa,
        )),
    )
  },
}

// Usually selected from the accounts provided by the extension
const alexaAddress = ss58.encode(42, alexa.publicKey)

const sender = pjsSender(chain, pjsSigner)

console.log(
  await Balances
    .transfer({
      value: 12345n,
      dest: billy.address,
    })
    .signed(signature({ sender: sender(alexaAddress) }))
    .sent()
    .dbgStatus()
    .finalizedEvents()
    .run(),
)
