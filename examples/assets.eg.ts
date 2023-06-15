import { rococoDevWestmint } from "@capi/rococo-dev-westmint"
import { $, createDevUsers, is, Rune, Scope } from "capi"
import { signature } from "capi/patterns/signature/statemint"

const scope = new Scope()

const { alexa, billy } = await createDevUsers()

const ASSET_ID = 0
const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

await rococoDevWestmint.Assets.create({
  id: ASSET_ID,
  admin: alexa.address,
  minBalance: 1n,
}).signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Create Asset:")
  .finalized()
  .run(scope)

await rococoDevWestmint.Assets.setMetadata({
  id: ASSET_ID,
  name: textEncoder.encode("Capi Socks"),
  symbol: textEncoder.encode("CAPI"),
  decimals: 2,
}).signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Set Metadata")
  .finalized()
  .run(scope)

await rococoDevWestmint.Assets.Metadata.value(ASSET_ID)
  .unhandle(is(undefined))
  .dbg("Asset Metadata")
  .map((metadata) => ({
    ...metadata,
    name: textDecoder.decode(metadata.name),
    symbol: textDecoder.decode(metadata.symbol),
  }))
  .run(scope)

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
