import * as $ from "../deps/scale.ts"

export type ConnectionV0 = $.Native<typeof $connectionV0>
export const $connectionV0 = $.taggedUnion("type", [
  $.variant("WsConnection", $.field("discovery", $.str)),
  $.variant("DevnetConnection", $.field("discovery", $.str)),
])

export type CodegenEntryV0 = $.Native<typeof $codegenEntryV0>
const $codegenEntryV0 = $.taggedUnion("type", [
  $.variant(
    "frame",
    $.field("metadataHash", $.sizedUint8Array(64)),
    $.field("chainName", $.str),
    $.optionalField("connection", $connectionV0),
  ),
])

export type CodegenSpec = $.Native<typeof $codegenSpec>
export const $codegenSpec = $.taggedUnion("type", [
  $.variant(
    "v0",
    $.field("codegen", $.map($.str, $codegenEntryV0)),
  ),
])
