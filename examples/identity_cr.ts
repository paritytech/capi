import { $, alice } from "capi"
import { IdentityInfoTranscoders } from "capi/patterns/identity.ts"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { chain, Identity } from "polkadot_dev/mod.ts"

const transcoders = new IdentityInfoTranscoders({ stars: $.u8 })

const info = transcoders.encode({
  display: "Chev Chelios",
  additional: { stars: 5 },
})

await Identity
  .setIdentity({ info })
  .signed(signature(chain, { sender: alice }))
  .sent()
  .dbgStatus()
  .finalized()
  .run()

const raw = Identity.IdentityOf
  .value(alice.publicKey)
  .unhandle(undefined)
  .access("info")

console.log(await transcoders.decode(raw).run())
