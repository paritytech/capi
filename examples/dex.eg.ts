import { localDev, NativeOrAssetId, PalletAssetConversionEvent } from "@capi/local-dev"
import { $, alice, bob, CodecRune, hex } from "capi"
import { signature } from "capi/patterns/signature/statemint"
import { Rune, RunicArgs, Scope } from "../rune/Rune.ts"

const scope = new Scope()

const DOT_ASSET_ID = 0
const USDT_ASSET_ID = 1

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

await localDev.Assets.create({
  id: DOT_ASSET_ID,
  admin: alice.address,
  minBalance: 1n,
}).signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Create DOT Asset:")
  .finalizedEvents()
  .unhandleFailed()
  .run(scope)

await localDev.Assets.setMetadata({
  id: DOT_ASSET_ID,
  name: textEncoder.encode("Polkadot Token"),
  symbol: textEncoder.encode("DOT"),
  decimals: 2,
}).signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Set DOT Metadata:")
  .finalizedEvents()
  .unhandleFailed()
  .run(scope)

await localDev.Assets.create({
  id: USDT_ASSET_ID,
  admin: alice.address,
  minBalance: 1n,
}).signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Create USDT Asset:")
  .finalizedEvents()
  .unhandleFailed()
  .run(scope)

await localDev.Assets.setMetadata({
  id: USDT_ASSET_ID,
  name: textEncoder.encode("United States Tether"),
  symbol: textEncoder.encode("USDT"),
  decimals: 2,
}).signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Set USDT Metadata:")
  .finalizedEvents()
  .unhandleFailed()
  .run(scope)

const poolId = await localDev.AssetConversion.createPool({
  asset1: NativeOrAssetId.Asset(DOT_ASSET_ID),
  asset2: NativeOrAssetId.Asset(USDT_ASSET_ID),
}).signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Create DOT/USDT Pool:")
  .finalizedEvents()
  .unhandleFailed()
  .pipe(filterPoolCreatedEvents)
  .access(0, "poolId")
  .run(scope)

await localDev.Assets.mint({
  id: DOT_ASSET_ID,
  beneficiary: alice.address,
  amount: 218173n,
}).signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Mint DOT to Alice:")
  .finalizedEvents()
  .unhandleFailed()
  .run(scope)

await localDev.Assets.mint({
  id: USDT_ASSET_ID,
  beneficiary: alice.address,
  amount: 1000000n,
}).signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Mint USDT to Alice:")
  .finalizedEvents()
  .unhandleFailed()
  .run(scope)

await localDev.AssetConversion.addLiquidity({
  asset1: NativeOrAssetId.Asset(DOT_ASSET_ID),
  asset2: NativeOrAssetId.Asset(USDT_ASSET_ID),
  amount1Desired: 218173n,
  amount2Desired: 1000000n,
  amount1Min: 218173n,
  amount2Min: 1000000n,
  mintTo: alice.publicKey,
}).signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Add Liquidity to DOT/USDT Pool:")
  .finalizedEvents()
  .unhandleFailed()
  .run(scope)

await localDev.Assets.mint({
  id: USDT_ASSET_ID,
  beneficiary: bob.address,
  amount: 30000n,
}).signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Mint USDT to Bob:")
  .finalizedEvents()
  .unhandleFailed()
  .run(scope)

const $assetId = await localDev.metadata.access(
  "paths",
  "pallet_asset_conversion::types::NativeOrAssetId",
).run(scope)

const $assetConversionApiQuoteArgs = $.tuple(
  // asset 1
  $assetId,
  // asset 2
  $assetId,
  // asset balance
  $.u128,
  // include fee
  $.bool,
)

const quoteArgs = Rune.constant($assetConversionApiQuoteArgs)
  .into(CodecRune)
  .encoded(
    Rune.tuple([
      NativeOrAssetId.Asset(USDT_ASSET_ID),
      NativeOrAssetId.Asset(DOT_ASSET_ID),
      30000n,
      true,
    ]),
  )

console.log(
  await localDev.connection.call(
    "state_call",
    "AssetConversionApi_quote_price_exact_tokens_for_tokens",
    quoteArgs.map(hex.encode),
  ).map(hex.decode).map((x) => $.u128.decode(x)).run(scope),
)

// swap with no slippage checks
await localDev.AssetConversion.swapExactTokensForTokens({
  path: Rune.tuple([NativeOrAssetId.Asset(USDT_ASSET_ID), NativeOrAssetId.Asset(DOT_ASSET_ID)]),
  amountIn: 30000n,
  amountOutMin: 1n,
  sendTo: bob.publicKey,
  keepAlive: false,
}).signed(signature({ sender: bob }))
  .sent()
  .dbgStatus("Bob Swap 30k USDT for DOT:")
  .finalizedEvents()
  .unhandleFailed()
  .run(scope)

function filterPoolCreatedEvents<X>(...[events]: RunicArgs<X, [any[]]>) {
  return Rune.resolve(events).map((events) =>
    events
      .map((e) => e.event)
      .map((e) => e.value)
      .filter((event): event is PalletAssetConversionEvent.PoolCreated =>
        event.type === "PoolCreated"
      )
  )
}
