import { alice, bob } from "capi"
import { createTestPairs } from "https://deno.land/x/polkadot@0.2.25/keyring/mod.ts"
import { TypeRegistry } from "https://deno.land/x/polkadot@0.2.25/types/mod.ts"
import { Balances } from "polkadot_dev/mod.ts"

console.log(
  await Balances
    .transfer({
      value: 12345n,
      dest: bob.address,
    })
    .signed({
      sender: {
        address: alice.address,
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
    .dbgStatus()
    .finalizedEvents()
    .run(),
)
