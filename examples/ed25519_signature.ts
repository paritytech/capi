import { Balances, users } from "westend_dev/mod.js"
import { signature } from "../patterns/signature/polkadot.ts"

const [alexa, billy] = await users(2)

const ed25519Alexa = alexa.toEd25519()

const result = await Balances
  .transfer({
    value: 12345n,
    dest: billy.address,
  })
  .signed(signature({ sender: ed25519Alexa }))
  .sent()
  .dbgStatus()
  .finalizedEvents()
  .run()

console.log(result)
