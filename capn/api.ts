import * as $ from "../deps/scale.ts"
import { $fn } from "./scald.ts"

export type DevChain = $.Native<typeof $devChain>
export const $devChain = $.object(
  $.field("url", $.str),
  $.field("nextUsers", $fn($.tuple($.u32), $.u32)),
)

export type Api = $.Native<typeof $api>
export const $api = $.object(
  $.field("getChain", $fn($.tuple($.str), $devChain)),
  $.field("getNetwork", $fn($.tuple($.str), $.map($.str, $devChain))),
)
