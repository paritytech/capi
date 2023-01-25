import * as C from "http://localhost:5646/@local/mod.ts"
import { collectExtrinsicEvents } from "http://localhost:5646/@local/test_util/extrinsic.ts"

import * as T from "http://localhost:5646/@local/test_util/mod.ts"
import * as U from "http://localhost:5646/@local/util/mod.ts"
import { createTestPairs } from "https://deno.land/x/polkadot@0.0.8/keyring/mod.ts"
import { TypeRegistry } from "https://deno.land/x/polkadot@0.0.8/types/mod.ts"

const root = collectExtrinsicEvents(
  C.extrinsic(T.westend)({
    sender: T.dave.address,
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
            .sign(createTestPairs().dave!),
        )
      },
    }),
).next(console.log)

U.throwIfError(await root.run())
