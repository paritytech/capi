import * as $ from "../deps/scale.ts"
import { $connectionSpec } from "../nets/mod.ts"

export type CodegenEntry = $.Output<typeof $codegenEntry>
const $codegenEntry = $.taggedUnion("type", [
  $.variant(
    "frame",
    $.field("metadataHash", $.sizedUint8Array(64)),
    $.field("chainName", $.str),
    $.field("connection", $connectionSpec),
    $.optionalField("targets", $.record($connectionSpec)),
  ),
])

export type CodegenSpec = $.Output<typeof $codegenSpec>
export const $codegenSpec = $.taggedUnion("type", [
  $.variant(
    "v0",
    $.field("codegen", $.map($.str, $codegenEntry)),
  ),
])
