import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export const $event: $.Codec<t.pallet_offences.pallet.Event> = _codec.$44

/** Events type. */
export type Event = t.pallet_offences.pallet.Event.Offence
export namespace Event {
  /**
   * There is an offence reported of the given `kind` happened at the `session_index` and
   * (kind-specific) time slot. This event is not deposited for duplicate slashes.
   * \[kind, timeslot\].
   */
  export interface Offence {
    type: "Offence"
    kind: Uint8Array
    timeslot: Uint8Array
  }
  /**
   * There is an offence reported of the given `kind` happened at the `session_index` and
   * (kind-specific) time slot. This event is not deposited for duplicate slashes.
   * \[kind, timeslot\].
   */
  export function Offence(
    value: Omit<t.pallet_offences.pallet.Event.Offence, "type">,
  ): t.pallet_offences.pallet.Event.Offence {
    return { type: "Offence", ...value }
  }
}
