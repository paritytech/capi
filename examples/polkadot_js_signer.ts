import { ss58 } from "capi"
import { pjsSender } from "capi/patterns/compat/pjs_sender.ts"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { createTestPairs } from "https://deno.land/x/polkadot@0.2.25/keyring/mod.ts"
import { TypeRegistry } from "https://deno.land/x/polkadot@0.2.25/types/mod.ts"
import { Balances, chain, users } from "polkadot_dev/mod.js"

const [a, b] = await users(2)

// Usually injected by an extension, e.g.
// const pjsSigner = (await web3FromSource("polkadot-js")).signer!;
const pjsSigner = {
  signPayload(payload: any) {
    const tr = new TypeRegistry()
    tr.setSignedExtensions(payload.signedExtensions)
    return Promise.resolve(
      tr.createType("ExtrinsicPayload", payload, { version: payload.version })
        .sign(createTestPairs().alice!),
    )
  },
}

// Usually selected from the accounts provided by the extension
const aliceAddress = ss58.encode(42, a.publicKey)

const sender = pjsSender(chain, pjsSigner)

console.log(
  await Balances
    .transfer({
      value: 12345n,
      dest: b.address,
    })
    .signed(signature({ sender: sender(aliceAddress) }))
    .sent()
    .dbgStatus()
    .finalizedEvents()
    .run(),
)
