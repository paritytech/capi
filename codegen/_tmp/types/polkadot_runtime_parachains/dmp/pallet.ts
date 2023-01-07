import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export const $call: $.Codec<types.polkadot_runtime_parachains.dmp.pallet.Call> = codecs.$406
/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call = never
