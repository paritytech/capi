import * as C from "capi/mod.ts"
import { Balances } from "polkadot_dev/mod.ts"

// Dynamic import because type-checking polkadot-js causes OOM
const { createTestPairs } = await import(`https://deno.land/x/polkadot@0.2.25/keyring/mod.ts`)
const { TypeRegistry } = await import(`https://deno.land/x/polkadot@0.2.25/types/mod.ts`)

await Balances
  .transfer({
    value: 12345n,
    dest: C.bob.address,
  })
  .signed({
    sender: {
      address: C.alice.address,
      sign: {
        signPayload(payload) {
          const tr = new TypeRegistry()
          tr.setSignedExtensions(payload.signedExtensions)
          return Promise.resolve(
            tr.createType("ExtrinsicPayload", payload, { version: payload.version })
              .sign(createTestPairs().alice!),
          )
        },
      },
    },
  })
  .sent()
  .logStatus()
  .finalized()
  .run()
