import { Assets, users } from "contracts_dev/mod.js"
import { signature } from "../patterns/signature/polkadot.ts"

const [alexa, billy, carol] = await users(3)

const id = 1

const x = await Assets
  .create({
    id,
    admin: alexa.address,
    minBalance: 1_000_000_000_000n,
  })
  .signed(signature({ sender: alexa }) as any)
  .sent()
  .inBlockEvents()
  .run()

console.log(x)
