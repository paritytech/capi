import { createTestPairs } from "https://deno.land/x/polkadot@0.0.8/keyring/mod.ts"
import { TypeRegistry } from "https://deno.land/x/polkadot@0.0.8/types/mod.ts"

import * as C from "#capi/mod.ts"
import * as T from "#capi/test_util/mod.ts"
import * as U from "#capi/util/mod.ts"

const root = C.extrinsic(T.westend)({
  sender: T.alice.address,
  call: {
    type: "Balances",
    value: {
      type: "transfer",
      value: 12345n,
      dest: T.bob.address,
    },
  },
})
  .signed({
    signPayload(payload) {
      const tr = new TypeRegistry()
      tr.setSignedExtensions(payload.signedExtensions)
      return Promise.resolve(
        tr
          .createType("ExtrinsicPayload", payload, { version: payload.version })
          .sign(createTestPairs().alice!),
      )
    },
  })
  .watch((ctx) =>
    (status) => {
      console.log(status)
      if (C.rpc.known.TransactionStatus.isTerminal(status)) {
        return ctx.end()
      }
      return
    }
  )

U.throwIfError(await root.run())
