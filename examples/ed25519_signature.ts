import * as ed from "https://esm.sh/@noble/ed25519@1.7.3"
import { Balances, createUsers } from "westend_dev/mod.js"
import { MultiAddress } from "westend_dev/types/sp_runtime/multiaddress.js"
import { Rune } from "../mod.ts"
import { signature } from "../patterns/signature/polkadot.ts"

const { alexa, billy } = await createUsers()

const eddieSecretKey = crypto.getRandomValues(new Uint8Array(32))
const eddiePublicKey = await ed.getPublicKey(eddieSecretKey)
const eddie = Rune.rec({
  address: MultiAddress.Id(eddiePublicKey),
  sign: async (msg: Uint8Array) => ({
    type: "Ed25519" as const,
    value: await ed.sign(msg, eddieSecretKey),
  }),
})

// Existential Deposit
await Balances
  .transfer({
    value: 1_000_000_000_000n,
    dest: eddie.access("address"),
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .finalized()
  .run()

console.log(
  await Balances
    .transfer({
      value: 12345n,
      dest: billy.address,
    })
    .signed(signature({ sender: eddie }))
    .sent()
    .dbgStatus()
    .finalizedEvents()
    .run(),
)
