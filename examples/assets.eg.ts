/**
 * @title Asset Palette Example
 * @stability unstable
 * @description Various calls utilizing the asset palette
 */

import { rococoDevWestmint } from "@capi/rococo-dev-westmint"
import { assertEquals, assertRejects } from "asserts"
import { createDevUsers, is, Rune, Scope } from "capi"
import { signature } from "capi/patterns/signature/statemint"

const scope = new Scope()

const { alexa, billy, carol } = await createDevUsers()

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
  .dbgStatus("Set Metadata:")
  .finalized()
  .run(scope)

await rococoDevWestmint.Assets.Metadata.value(ASSET_ID)
  .unhandle(is(undefined))
  .map((metadata) => ({
    ...metadata,
    name: textDecoder.decode(metadata.name),
    symbol: textDecoder.decode(metadata.symbol),
  }))
  .dbg("Asset Metadata:")
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
  .dbg("Billy Asset Balance:")
  .run(scope)

await rococoDevWestmint.Assets.burn({
  id: ASSET_ID,
  who: billy.address,
  amount: 5n,
}).signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Burn Billy's Assets:")
  .finalized()
  .run(scope)

await rococoDevWestmint.Assets.Account
  .value(Rune.tuple([ASSET_ID, billy.publicKey]))
  .unhandle(is(undefined))
  .map(({ balance }) => balance)
  .dbg("Billy Asset Balance Post Burn:")
  .run(scope)

await rococoDevWestmint.Assets.freeze({
  id: ASSET_ID,
  who: billy.address,
}).signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Freeze Billy's Assets:")
  .finalized()
  .run(scope)

await assertRejects(async () =>
  rococoDevWestmint.Assets.transfer({
    id: ASSET_ID,
    target: carol.address,
    amount: 1n,
  })
    .signed(signature({ sender: billy }))
    .sent()
    .dbgStatus("Billy Transfer Frozen Assets:")
    .finalizedEvents()
    .unhandleFailed()
    .run(scope), "Transfer Frozen Assets")

await rococoDevWestmint.Assets.thaw({
  id: ASSET_ID,
  who: billy.address,
}).signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Thaw Billy's Assets:")
  .finalized()
  .run(scope)

await rococoDevWestmint.Assets.transfer({
  id: ASSET_ID,
  target: carol.address,
  amount: 1n,
})
  .signed(signature({ sender: billy }))
  .sent()
  .dbgStatus("Billy Transfer Thawed Assets:")
  .finalizedEvents()
  .unhandleFailed()
  .run(scope)

const carolBalance = await rococoDevWestmint.Assets.Account
  .value(Rune.tuple([ASSET_ID, carol.publicKey]))
  .unhandle(is(undefined))
  .map(({ balance }) => balance)
  .dbg("Carol Asset Balance:")
  .run(scope)

assertEquals(carolBalance, 1n, "Carol Balance")

await rococoDevWestmint.Utility.batchAll({
  calls: Rune.array([alexa.address, billy.address, carol.address])
    .mapArray((addr) =>
      rococoDevWestmint.Assets.burn({
        id: ASSET_ID,
        who: addr,
        amount: 100_000_000_000_000n,
      })
    ),
}).signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Burn Everything:")
  .finalized()
  .run(scope)

await rococoDevWestmint.Assets.startDestroy({
  id: ASSET_ID,
}).signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Destroy Asset Class Start:")
  .finalizedEvents()
  .unhandleFailed()
  .run(scope)

await rococoDevWestmint.Assets.finishDestroy({
  id: ASSET_ID,
}).signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Destroy Asset Class Finish:")
  .finalizedEvents()
  .unhandleFailed()
  .run(scope)
