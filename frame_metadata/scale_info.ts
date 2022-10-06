import * as $ from "../deps/scale.ts";

export class TyDecodeCtx {
  tys: Ty[] | null = null;
}

export const $tys: $.Codec<Ty[]> = $.createCodec({
  name: "tys",
  _metadata: null,
  _staticSize: $.compactU32._staticSize,
  _encode(buffer, value) {
    $.array($ty)._encode(buffer, value);
  },
  _decode(buffer) {
    const length = $.compactU32._decode(buffer);
    const ctx = buffer.context.get(TyDecodeCtx);
    const tys = ctx.tys = Array.from({ length }, (_, id) => ({ id } as Ty));
    for (let i = 0; i < length; i++) {
      Object.assign(tys[i]!, $ty._decode(buffer));
    }
    return tys;
  },
});

export const $tyId: $.Codec<Ty> = $.createCodec({
  name: "tyId",
  _metadata: null,
  _staticSize: $.compactU32._staticSize,
  _encode(buffer, value) {
    $.compactU32._encode(buffer, value.id);
  },
  _decode(buffer) {
    const ctx = buffer.context.get(TyDecodeCtx);
    const id = $.compactU32._decode(buffer);
    return ctx.tys?.[id] ?? { id } as any;
  },
});

export interface Field {
  name: string | undefined;
  ty: Ty;
  typeName: string | undefined;
  docs: string[];
}
export const $field: $.Codec<Field> = $.object(
  ["name", $.option($.str)],
  ["ty", $tyId],
  ["typeName", $.option($.str)],
  ["docs", $.array($.str)],
);

export type PrimitiveKind = $.Native<typeof $primitiveKind>;
const $primitiveKind = $.stringUnion([
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
]);

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
  typeParam: Ty;
}
export interface SizedArrayTyDef {
  type: "SizedArray";
  len: number;
  typeParam: Ty;
}
export interface TupleTyDef {
  type: "Tuple";
  fields: Ty[];
}
export interface PrimitiveTyDef {
  type: "Primitive";
  kind: PrimitiveKind;
}
export interface CompactTyDef {
  type: "Compact";
  typeParam: Ty;
}
export interface BitSequenceTyDef {
  type: "BitSequence";
  bitOrderType: Ty;
  bitStoreType: Ty;
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
export const $tyDef: $.Codec<TyDef> = $.taggedUnion("type", [
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
    ["typeParam", $tyId],
  ],
  [
    "SizedArray",
    ["len", $.u32],
    ["typeParam", $tyId],
  ],
  [
    "Tuple",
    ["fields", $.array($tyId)],
  ],
  [
    "Primitive",
    ["kind", $primitiveKind],
  ],
  [
    "Compact",
    ["typeParam", $tyId],
  ],
  [
    "BitSequence",
    ["bitOrderType", $tyId],
    ["bitStoreType", $tyId],
  ],
]);

export interface Param {
  name: string;
  ty: Ty | undefined;
}
export const $param: $.Codec<Param> = $.object(
  ["name", $.str],
  ["ty", $.option($tyId)],
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
      ["id", $.compactU32],
      ["path", $.array($.str)],
      ["params", $.array($param)],
    ),
    $tyDef,
  ),
  $.object(
    ["docs", $.array($.str)],
  ),
);
