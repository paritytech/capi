import { PalletAssetConversionEvent } from "@capi/local-dev"
import { Rune, RunicArgs } from "../../../mod.ts"

export function filterPoolCreatedEvents<X>(...[events]: RunicArgs<X, [any[]]>) {
  return Rune.resolve(events).map((events) =>
    events
      .map((e) => e.event)
      .map((e) => e.value)
      .filter((event): event is PalletAssetConversionEvent.PoolCreated =>
        event.type === "PoolCreated"
      )
  )
}

export function filterLiquidityAddedEvent<X>(...[events]: RunicArgs<X, [any[]]>) {
  return Rune.resolve(events).map((events) =>
    events
      .map((e) => e.event)
      .map((e) => e.value)
      .filter((event): event is PalletAssetConversionEvent.LiquidityAdded =>
        event.type === "LiquidityAdded"
      )
  )
}
