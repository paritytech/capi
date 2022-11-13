import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as types from "../../../types/mod.ts"

export const $origin: $.Codec<types.polkadot_runtime_parachains.origin.pallet.Origin> = _codec.$260

export type Origin = types.polkadot_runtime_parachains.origin.pallet.Origin.Parachain
export namespace Origin {
  export interface Parachain {
    type: "Parachain"
    value: types.polkadot_parachain.primitives.Id
  }
  export function Parachain(
    value: types.polkadot_runtime_parachains.origin.pallet.Origin.Parachain["value"],
  ): types.polkadot_runtime_parachains.origin.pallet.Origin.Parachain {
    return { type: "Parachain", value }
  }
}
