import { $ } from "capi"
import { IdentityInfoTranscoders } from "capi/patterns/identity.ts"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { Identity, users } from "polkadot_dev/mod.js"

const { alexa } = await users()

const transcoders = new IdentityInfoTranscoders({ stars: $.u8 })

const info = transcoders.encode({
  display: "Chev Chelios",
  additional: { stars: 5 },
})

await Identity
  .setIdentity({ info })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus()
  .finalized()
  .run()

const raw = Identity.IdentityOf
  .value(alexa.publicKey)
  .unhandle(undefined)
  .access("info")

console.log(await transcoders.decode(raw).run())
