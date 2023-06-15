import { rococoDevWestmint } from "@capi/rococo-dev-westmint"
import { $, createDevUsers, is, Rune, Scope } from "capi"
import { signature } from "capi/patterns/signature/statemint"

const scope = new Scope()

const { alexa, billy } = await createDevUsers()

const ASSET_ID = 0

// Create a new class of assets
await rococoDevWestmint.Assets.create({
  id: ASSET_ID,
  admin: alexa.address,
  minBalance: 1n,
}).signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Create Asset:")
  .finalized()
  .run(scope)

// Mint 1000 units to Alexa
await rococoDevWestmint.Assets.mint({
  id: ASSET_ID,
  beneficiary: alexa.address,
  amount: 1000n,
}).signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Mint Asset:")
  .finalized()
  .run(scope)

await rococoDevWestmint.Assets.transfer({
  id: ASSET_ID,
  target: billy.address,
  amount: 10n,
})
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Transfer Asset to Billy:")
  .finalized()
  .run(scope)

await rococoDevWestmint.Assets.Account
  .value(Rune.tuple([ASSET_ID, billy.publicKey]))
  .unhandle(is(undefined))
  .map(({ balance }) => balance)
  .dbg("Billy Asset Balance")
  .run(scope)
