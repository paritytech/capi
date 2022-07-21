import * as $ from "../deps/scale.ts";

export interface Field {
  name: string | undefined;
  ty: number;
  typeName: string | undefined;
  docs: string[];
}
export const $field: $.Codec<Field> = $.object(
  ["name", $.option($.str)],
  ["ty", $.nCompact],
  ["typeName", $.option($.str)],
  ["docs", $.array($.str)],
);

export type PrimitiveKind = $.Native<typeof $primitiveKind>;
const $primitiveKind = $.keyLiteralUnion(
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
);

export type TyType = TyDef["type"];
export interface StructTyDef {
  type: "Struct";
  fields: Field[];
}
export interface UnionTyDefMember {
  name: string;
  fields: Field[];
  index: number;
  docs: string[];
}
export interface UnionTyDef {
  type: "Union";
  members: UnionTyDefMember[];
}
export interface SequenceTyDef {
  type: "Sequence";
  typeParam: number;
}
export interface SizedArrayTyDef {
  type: "SizedArray";
  len: number;
  typeParam: number;
}
export interface TupleTyDef {
  type: "Tuple";
  fields: number[];
}
export interface PrimitiveTyDef {
  type: "Primitive";
  kind: PrimitiveKind;
}
export interface CompactTyDef {
  type: "Compact";
  typeParam: number;
}
export interface BitSequenceTyDef {
  type: "BitSequence";
  bitOrderType: number;
  bitStoreType: number;
}
export type TyDef =
  | StructTyDef
  | UnionTyDef
  | SequenceTyDef
  | SizedArrayTyDef
  | TupleTyDef
  | PrimitiveTyDef
  | CompactTyDef
  | BitSequenceTyDef;
export const $tyDef: $.Codec<TyDef> = $.taggedUnion(
  "type",
  [
    "Struct",
    ["fields", $.array($field)],
  ],
  [
    "Union",
    [
      "members",
      $.array($.object(
        ["name", $.str],
        ["fields", $.array($field)],
        ["index", $.u8],
        ["docs", $.array($.str)],
      )),
    ],
  ],
  [
    "Sequence",
    ["typeParam", $.nCompact],
  ],
  [
    "SizedArray",
    ["len", $.u32],
    ["typeParam", $.nCompact],
  ],
  [
    "Tuple",
    ["fields", $.array($.nCompact)],
  ],
  [
    "Primitive",
    ["kind", $primitiveKind],
  ],
  [
    "Compact",
    ["typeParam", $.nCompact],
  ],
  [
    "BitSequence",
    ["bitOrderType", $.nCompact],
    ["bitStoreType", $.nCompact],
  ],
);

export interface Param {
  name: string;
  ty: number | undefined;
}
export const $param: $.Codec<Param> = $.object(
  ["name", $.str],
  ["ty", $.option($.nCompact)],
);

export type Ty = {
  id: number;
  path: string[];
  params: Param[];
  docs: string[];
} & TyDef;
export const $ty: $.Codec<Ty> = $.spread(
  $.spread(
    $.object(
      ["id", $.nCompact],
      ["path", $.array($.str)],
      ["params", $.array($param)],
    ),
    $tyDef,
  ),
  $.object(
    ["docs", $.array($.str)],
  ),
);
