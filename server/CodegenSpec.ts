import * as $ from "../deps/scale.ts"
import { $connectionSpec } from "../nets/mod.ts"

export type CodegenEntry = $.Native<typeof $codegenEntry>
const $codegenEntry = $.taggedUnion("type", [
  $.variant(
    "frame",
    $.field("metadataHash", $.sizedUint8Array(64)),
    $.field("chainName", $.str),
    $.optionalField("connection", $connectionSpec),
  ),
])

export type CodegenSpec = $.Native<typeof $codegenSpec>
export const $codegenSpec = $.taggedUnion("type", [
  $.variant(
    "v0",
    $.field("codegen", $.map($.str, $codegenEntry)),
  ),
])
