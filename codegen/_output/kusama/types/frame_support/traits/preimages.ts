import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as types from "../../../types/mod.ts"

export const $bounded: $.Codec<types.frame_support.traits.preimages.Bounded> = _codec.$180

export type Bounded =
  | types.frame_support.traits.preimages.Bounded.Legacy
  | types.frame_support.traits.preimages.Bounded.Inline
  | types.frame_support.traits.preimages.Bounded.Lookup
export namespace Bounded {
  export interface Legacy {
    type: "Legacy"
    hash: types.primitive_types.H256
  }
  export interface Inline {
    type: "Inline"
    value: Uint8Array
  }
  export interface Lookup {
    type: "Lookup"
    hash: types.primitive_types.H256
    len: types.u32
  }
  export function Legacy(
    value: Omit<types.frame_support.traits.preimages.Bounded.Legacy, "type">,
  ): types.frame_support.traits.preimages.Bounded.Legacy {
    return { type: "Legacy", ...value }
  }
  export function Inline(
    value: types.frame_support.traits.preimages.Bounded.Inline["value"],
  ): types.frame_support.traits.preimages.Bounded.Inline {
    return { type: "Inline", value }
  }
  export function Lookup(
    value: Omit<types.frame_support.traits.preimages.Bounded.Lookup, "type">,
  ): types.frame_support.traits.preimages.Bounded.Lookup {
    return { type: "Lookup", ...value }
  }
}
