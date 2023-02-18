import { alice, CodecRune, Rune } from "capi"
import { Identity } from "polkadot_dev/mod.ts"
import { Data, IdentityInfo } from "polkadot_dev/types/pallet_identity/types.ts"
import * as $ from "../deps/scale.ts"

await Identity
  .setIdentity({
    info: IdentityInfo(Rune.rec({
      display: Data.Raw13($.str.encode("Chev Chelios")),
      web: Data.None(),
      email: Data.None(),
      twitter: Data.None(),
      riot: Data.None(),
      image: Data.None(),
      legal: Data.None(),
      pgpFingerprint: undefined,
      additional: Rune.tuple([
        Rune.tuple([
          Data.Raw5($.str.encode("good")),
          Data.Raw6($.str.encode("movie")),
        ]),
      ]),
    })),
  })
  .signed({ sender: alice })
  .sent()
  .logStatus()
  .finalized()
  .run()

await Rune
  .constant($.str)
  .into(CodecRune)
  .decoded(Identity.IdentityOf.entry([alice.publicKey]).access("info", "display", "value"))
  .log()
  .run()
