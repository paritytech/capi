import { localDev, NativeOrAssetId } from "@capi/local-dev"
import { $, CodecRune, hex, Rune, RunicArgs } from "../../../mod.ts"

export function quotePriceExactTokensForTokens<X>(
  ...[asset1, asset2, amount, includeFee]: RunicArgs<
    X,
    [asset1: NativeOrAssetId, asset2: NativeOrAssetId, amount: bigint, includeFee: boolean]
  >
) {
  const $assetId = localDev.metadata.access(
    "paths",
    "pallet_asset_conversion::types::NativeOrAssetId",
  )

  const args = $assetId.map(($assetId) => $.tuple($assetId, $assetId, $.u128, $.bool))
    .into(CodecRune)
    .encoded(
      Rune.tuple([
        asset1,
        asset2,
        amount,
        includeFee,
      ]),
    )

  return localDev.connection
    .call(
      "state_call",
      "AssetConversionApi_quote_price_exact_tokens_for_tokens",
      args.map(hex.encode),
    )
    .map(hex.decode)
    .map((x) => $.u128.decode(x))
}

export function getReserves<X>(
  ...[asset1, asset2]: RunicArgs<
    X,
    [asset1: NativeOrAssetId, asset2: NativeOrAssetId]
  >
) {
  const $assetId = localDev.metadata.access(
    "paths",
    "pallet_asset_conversion::types::NativeOrAssetId",
  )

  const args = $assetId.map(($assetId) => $.tuple($assetId, $assetId))
    .into(CodecRune)
    .encoded(
      Rune.tuple([
        asset1,
        asset2,
      ]),
    )

  return localDev.connection
    .call(
      "state_call",
      "AssetConversionApi_get_reserves",
      args.map(hex.encode),
    )
    .map(hex.decode)
    .map((x) => $.tuple($.u128, $.u128).decode(x))
}
