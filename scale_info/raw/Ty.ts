import * as $ from "../../deps/scale.ts"

export const $tyId = $.compact($.u32)

export const $field = $.object(
  $.optionalField("name", $.str),
  $.field("ty", $tyId),
  $.optionalField("typeName", $.str),
  $.field("docs", $.array($.str)),
)

export const $primitiveKind = $.literalUnion([
  "bool",
  "char",
  "str",
  "u8",
  "u16",
  "u32",
  "u64",
  "u128",
  "u256",
  "i8",
  "i16",
  "i32",
  "i64",
  "i128",
  "i256",
])

export const $tyDef = $.taggedUnion("type", [
  $.variant("Struct", $.field("fields", $.array($field))),
  $.variant(
    "Union",
    $.field(
      "members",
      $.array($.object(
        $.field("name", $.str),
        $.field("fields", $.array($field)),
        $.field("index", $.u8),
        $.field("docs", $.array($.str)),
      )),
    ),
  ),
  $.variant("Sequence", $.field("typeParam", $tyId)),
  $.variant("SizedArray", $.field("len", $.u32), $.field("typeParam", $tyId)),
  $.variant("Tuple", $.field("fields", $.array($tyId))),
  $.variant("Primitive", $.field("kind", $primitiveKind)),
  $.variant("Compact", $.field("typeParam", $tyId)),
  $.variant("BitSequence", $.field("bitOrderType", $tyId), $.field("bitStoreType", $tyId)),
])

export type Ty = $.Native<typeof $ty>
export const $ty = $.object(
  $.field("id", $.compact($.u32)),
  $.field("path", $.array($.str)),
  $.field(
    "params",
    $.array($.object(
      $.field("name", $.str),
      $.optionalField("ty", $tyId),
    )),
  ),
  $tyDef,
  $.field("docs", $.array($.str)),
)
