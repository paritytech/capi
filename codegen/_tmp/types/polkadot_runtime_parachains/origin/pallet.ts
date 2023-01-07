import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export const $origin: $.Codec<types.polkadot_runtime_parachains.origin.pallet.Origin> = codecs.$259
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
