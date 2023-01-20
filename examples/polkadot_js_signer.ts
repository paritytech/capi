import * as C from "capi/mod.ts"
import { createTestPairs } from "https://deno.land/x/polkadot@0.0.8/keyring/mod.ts"
import { TypeRegistry } from "https://deno.land/x/polkadot@0.0.8/types/mod.ts"

import { Balances, extrinsic } from "polkadot_dev/mod.ts"

const root = extrinsic({
  sender: C.alice.address,
  call: Balances.transfer({
    value: 12345n,
    dest: C.bob.address,
  }),
})
  .signed({
    signPayload(payload) {
      const tr = new TypeRegistry()
      tr.setSignedExtensions(payload.signedExtensions)
      return Promise.resolve(
        tr
          .createType("ExtrinsicPayload", payload, { version: payload.version })
          .sign(createTestPairs().dave!),
      )
    },
  })
  .watch((ctx) => (status) => {
    console.log(status)
    if (typeof status !== "string" && status.finalized) {
      return ctx.end()
    }
    return
  })

C.throwIfError(await root.run())
