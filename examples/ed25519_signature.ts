import { Balances, users } from "westend_dev/mod.js"
import { MultiAddress } from "westend_dev/types/sp_runtime/multiaddress.js"
import * as ed from "../deps/ed25519.ts"
import { Rune } from "../mod.ts"
import { signature } from "../patterns/signature/polkadot.ts"

const [alexa, billy, eddie] = await users(3)

const ed25519PrivateKey = eddie.secretKey.slice(0, 32)
const ed25519PublicKey = await ed.getPublicKey(ed25519PrivateKey)

const ed25519Eddie = Rune.rec({
  address: MultiAddress.Id(ed25519PublicKey),
  sign: async (msg: Uint8Array) => ({
    type: "Ed25519" as const,
    value: await ed.sign(msg, ed25519PrivateKey),
  }),
})

// Existential Deposit
await Balances
  .transfer({
    value: 1_000_000_000_000n,
    dest: ed25519Eddie.access("address"),
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .finalizedHash()
  .run()

console.log(
  await Balances
    .transfer({
      value: 12345n,
      dest: billy.address,
    })
    .signed(signature({ sender: ed25519Eddie }))
    .sent()
    .dbgStatus()
    .finalizedEvents()
    .run(),
)
