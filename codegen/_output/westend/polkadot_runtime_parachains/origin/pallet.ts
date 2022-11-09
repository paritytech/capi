import { $, BitSequence, ChainError, Era } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"
export const $origin: $.Codec<t.polkadot_runtime_parachains.origin.pallet.Origin> = _codec.$260

export type Origin = t.polkadot_runtime_parachains.origin.pallet.Origin.Parachain
export namespace Origin {
  export interface Parachain {
    type: "Parachain"
    value: t.polkadot_parachain.primitives.Id
  }
  export function Parachain(
    value: t.polkadot_runtime_parachains.origin.pallet.Origin.Parachain["value"],
  ): t.polkadot_runtime_parachains.origin.pallet.Origin.Parachain {
    return { type: "Parachain", value }
  }
}
