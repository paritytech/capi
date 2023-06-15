import { rococoDevWestmint } from "@capi/rococo-dev-westmint"
import { $, createDevUsers, is, Rune, Scope } from "capi"
import { signature } from "capi/patterns/signature/statemint"

const scope = new Scope()

const { alexa, billy } = await createDevUsers()

// Create a new class of assets
await rococoDevWestmint.Assets.create({
  id: 0,
  admin: alexa.address,
  minBalance: 1n,
}).signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Create Asset:")
  .finalized()
  .run(scope)

// Mint 1000 units to Alexa
await rococoDevWestmint.Assets.mint({
  id: 0,
  beneficiary: alexa.address,
  amount: 1000n,
}).signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Mint Asset:")
  .finalized()
  .run(scope)

// await rococoDevWestmint.Assets.transfer({})
