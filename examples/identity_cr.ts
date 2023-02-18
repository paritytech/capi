import { $, alice } from "capi"
import { IdentityInfoUtil } from "capi/patterns/identity.ts"
import { Identity } from "polkadot_dev/mod.ts"

const info = new IdentityInfoUtil({ stars: $.u8 })

await Identity
  .setIdentity({
    info: info.encode({
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

await info
  .decode(Identity.IdentityOf.entry([alice.publicKey]).access("info"))
  .log()
  .run()
