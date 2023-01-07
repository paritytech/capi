import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export const $event: $.Codec<types.pallet_offences.pallet.Event> = codecs.$44
/** Events type. */

export type Event = types.pallet_offences.pallet.Event.Offence
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
    value: Omit<types.pallet_offences.pallet.Event.Offence, "type">,
  ): types.pallet_offences.pallet.Event.Offence {
    return { type: "Offence", ...value }
  }
}
