import { $, alice } from "capi"
import { IdentityInfoTranscoders } from "capi/patterns/identity.ts"
import { Identity } from "polkadot_dev/mod.ts"

const t = new IdentityInfoTranscoders({ stars: $.u8 })

await Identity
  .setIdentity({
    info: t.encode({
      display: "Chev Chelios",
      additional: {
        stars: 5,
      },
    }),
  })
  .signed({ sender: alice })
  .sent()
  .logStatus()
  .finalized()
  .run()

await t
  .decode(Identity.IdentityOf.entry([alice.publicKey]).access("info"))
  .log()
  .run()
