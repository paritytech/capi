import { $, BitSequence, ChainError, Era } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"
export const $bounded: $.Codec<t.frame_support.traits.preimages.Bounded> = _codec.$180

export type Bounded =
  | t.frame_support.traits.preimages.Bounded.Legacy
  | t.frame_support.traits.preimages.Bounded.Inline
  | t.frame_support.traits.preimages.Bounded.Lookup
export namespace Bounded {
  export interface Legacy {
    type: "Legacy"
    hash: t.primitive_types.H256
  }
  export interface Inline {
    type: "Inline"
    value: Uint8Array
  }
  export interface Lookup {
    type: "Lookup"
    hash: t.primitive_types.H256
    len: t.u32
  }
  export function Legacy(
    value: Omit<t.frame_support.traits.preimages.Bounded.Legacy, "type">,
  ): t.frame_support.traits.preimages.Bounded.Legacy {
    return { type: "Legacy", ...value }
  }
  export function Inline(
    value: t.frame_support.traits.preimages.Bounded.Inline["value"],
  ): t.frame_support.traits.preimages.Bounded.Inline {
    return { type: "Inline", value }
  }
  export function Lookup(
    value: Omit<t.frame_support.traits.preimages.Bounded.Lookup, "type">,
  ): t.frame_support.traits.preimages.Bounded.Lookup {
    return { type: "Lookup", ...value }
  }
}
