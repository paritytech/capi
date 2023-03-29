import * as $ from "../deps/scale.ts"

export type CodegenEntry = $.Native<typeof $codegenEntry>
const $codegenEntry = $.taggedUnion("type", [
  $.variant(
    "frame",
    $.field("metadata", $.sizedUint8Array(64)),
    $.field("chainName", $.str),
    $.field(
      "connection",
      $.taggedUnion("type", [
        $.variant("ws", $.field("discovery", $.str)),
        $.variant("none"),
      ]),
    ),
  ),
])

export type CodegenSpec = $.Native<typeof $codegenSpec>
export const $codegenSpec = $.taggedUnion("type", [
  $.variant(
    "v0",
    $.field(
      "codegen",
      $.map(
        $.array($.str),
        $codegenEntry,
      ),
    ),
  ),
])
