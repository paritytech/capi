import { alice } from "capi"
import { Identity } from "polkadot_dev/mod.ts"
import * as $ from "../deps/scale.ts"
import { IdentityInfoUtil } from "../patterns/identity.ts"

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
