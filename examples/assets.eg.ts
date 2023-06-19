/**
 * @title Asset Palette Example
 * @stability unstable
 * @description Various calls utilizing the asset palette
 */

import { contractsDev } from "@capi/contracts-dev"
import { assertEquals, assertRejects } from "asserts"
import { createDevUsers, is, Rune, Scope } from "capi"
import { signature } from "capi/patterns/signature/polkadot"

const scope = new Scope()

const { alexa, billy, carol } = await createDevUsers()

const ASSET_ID = 0
const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

await contractsDev.Assets.create({
  id: ASSET_ID,
  admin: alexa.address,
  minBalance: 1n,
}).signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Create Asset:")
  .inBlockEvents()
  .run(scope)

await contractsDev.Assets.setMetadata({
  id: ASSET_ID,
  name: textEncoder.encode("Capi Socks"),
  symbol: textEncoder.encode("CAPI"),
  decimals: 2,
}).signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Set Metadata:")
  .inBlockEvents()
  .run(scope)

await contractsDev.Assets.Metadata.value(ASSET_ID, contractsDev.latestBlockHash)
  .unhandle(is(undefined))
  .map((metadata) => ({
    ...metadata,
    name: textDecoder.decode(metadata.name),
    symbol: textDecoder.decode(metadata.symbol),
  }))
  .dbg("Asset Metadata:")
  .run(scope)

await contractsDev.Assets.mint({
  id: ASSET_ID,
  beneficiary: alexa.address,
  amount: 1000n,
}).signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Mint Asset:")
  .inBlockEvents()
  .unhandleFailed()
  .run(scope)

await contractsDev.Assets.transfer({
  id: ASSET_ID,
  target: billy.address,
  amount: 10n,
})
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Transfer Asset to Billy:")
  .inBlockEvents()
  .unhandleFailed()
  .run(scope)

await contractsDev.Assets.Account
  .value(Rune.tuple([ASSET_ID, billy.publicKey]), contractsDev.latestBlockHash)
  .unhandle(is(undefined))
  .map(({ balance }) => balance)
  .dbg("Billy Asset Balance:")
  .run(scope)

await contractsDev.Assets.burn({
  id: ASSET_ID,
  who: billy.address,
  amount: 5n,
}).signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Burn Billy's Assets:")
  .inBlockEvents()
  .run(scope)

await contractsDev.Assets.Account
  .value(Rune.tuple([ASSET_ID, billy.publicKey]), contractsDev.latestBlockHash)
  .unhandle(is(undefined))
  .map(({ balance }) => balance)
  .dbg("Billy Asset Balance Post Burn:")
  .run(scope)

await contractsDev.Assets.freeze({
  id: ASSET_ID,
  who: billy.address,
}).signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Freeze Billy's Assets:")
  .inBlockEvents()
  .run(scope)

await assertRejects(async () =>
  contractsDev.Assets.transfer({
    id: ASSET_ID,
    target: carol.address,
    amount: 1n,
  })
    .signed(signature({ sender: billy }))
    .sent()
    .dbgStatus("Billy Transfer Frozen Assets:")
    .inBlockEvents()
    .unhandleFailed()
    .run(scope), "Transfer Frozen Assets")

await contractsDev.Assets.thaw({
  id: ASSET_ID,
  who: billy.address,
}).signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Thaw Billy's Assets:")
  .inBlockEvents()
  .run(scope)

await contractsDev.Assets.transfer({
  id: ASSET_ID,
  target: carol.address,
  amount: 1n,
})
  .signed(signature({ sender: billy }))
  .sent()
  .dbgStatus("Billy Transfer Thawed Assets:")
  .inBlockEvents()
  .unhandleFailed()
  .run(scope)

const carolBalance = await contractsDev.Assets.Account
  .value(Rune.tuple([ASSET_ID, carol.publicKey]), contractsDev.latestBlockHash)
  .unhandle(is(undefined))
  .map(({ balance }) => balance)
  .dbg("Carol Asset Balance:")
  .run(scope)

assertEquals(carolBalance, 1n, "Carol Balance")

await contractsDev.Utility.batchAll({
  calls: Rune.array([alexa.address, billy.address, carol.address])
    .mapArray((addr) =>
      contractsDev.Assets.burn({
        id: ASSET_ID,
        who: addr,
        amount: 100_000_000_000_000n,
      })
    ),
}).signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Burn Everything:")
  .inBlockEvents()
  .run(scope)

await contractsDev.Assets.startDestroy({
  id: ASSET_ID,
}).signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Destroy Asset Class Start:")
  .inBlockEvents()
  .unhandleFailed()
  .run(scope)

await contractsDev.Assets.finishDestroy({
  id: ASSET_ID,
}).signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Destroy Asset Class Finish:")
  .inBlockEvents()
  .unhandleFailed()
  .run(scope)
