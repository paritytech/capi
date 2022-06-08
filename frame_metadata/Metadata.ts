import * as hex from "/util/hex.ts";
import * as $ from "x/scale/mod.ts";

export interface Field {
  name: string | undefined;
  type: number;
  typeName: string | undefined;
  docs: string[];
}
export const $field: $.Codec<Field> = $.object(
  ["name", $.option($.str)],
  ["type", $.nCompact],
  ["typeName", $.option($.str)],
  ["docs", $.array($.str)],
);

export enum PrimitiveKind {
  Bool = "bool",
  Char = "char",
  Str = "str",
  U8 = "u8",
  U16 = "u16",
  U32 = "u32",
  U64 = "u64",
  U128 = "u128",
  U256 = "u256",
  I8 = "i8",
  I16 = "i16",
  I32 = "i32",
  I64 = "i64",
  I128 = "i128",
  I256 = "i256",
}
const $primitiveKind: $.Codec<PrimitiveKind> = $.keyLiteralUnion(
  PrimitiveKind.Bool,
  PrimitiveKind.Char,
  PrimitiveKind.Str,
  PrimitiveKind.U8,
  PrimitiveKind.U16,
  PrimitiveKind.U32,
  PrimitiveKind.U64,
  PrimitiveKind.U128,
  PrimitiveKind.U256,
  PrimitiveKind.I8,
  PrimitiveKind.I16,
  PrimitiveKind.I32,
  PrimitiveKind.I64,
  PrimitiveKind.I128,
  PrimitiveKind.I256,
);

export enum TypeKind {
  Struct = "Struct",
  Union = "Union",
  Sequence = "Sequence",
  SizedArray = "SizedArray",
  Tuple = "Tuple",
  Primitive = "Primitive",
  Compact = "Compact",
  BitSequence = "BitSequence",
}

export interface StructTypeDef {
  _tag: TypeKind.Struct;
  fields: Field[];
}
export interface UnionTypeDefMember {
  name: string;
  fields: Field[];
  i: number;
  docs: string[];
}
export interface UnionTypeDef {
  _tag: TypeKind.Union;
  members: UnionTypeDefMember[];
}
export interface SequenceTypeDef {
  _tag: TypeKind.Sequence;
  typeParam: number;
}
export interface SizedArrayTypeDef {
  _tag: TypeKind.SizedArray;
  len: number;
  typeParam: number;
}
export interface TupleTypeDef {
  _tag: TypeKind.Tuple;
  fields: number[];
}
export interface PrimitiveTypeDef {
  _tag: TypeKind.Primitive;
  kind: PrimitiveKind;
}
export interface CompactTypeDef {
  _tag: TypeKind.Compact;
  typeParam: number;
}
export interface BitSequenceTypeDef {
  _tag: TypeKind.BitSequence;
  bitOrderType: number;
  bitStoreType: number;
}
export type TypeDef =
  | StructTypeDef
  | UnionTypeDef
  | SequenceTypeDef
  | SizedArrayTypeDef
  | TupleTypeDef
  | PrimitiveTypeDef
  | CompactTypeDef
  | BitSequenceTypeDef;
export const $typeDef: $.Codec<TypeDef> = $.taggedUnion(
  "_tag",
  [
    TypeKind.Struct,
    ["fields", $.array($field)],
  ],
  [
    TypeKind.Union,
    [
      "members",
      $.array($.object(
        ["name", $.str],
        ["fields", $.array($field)],
        ["i", $.u8],
        ["docs", $.array($.str)],
      )),
    ],
  ],
  [
    TypeKind.Sequence,
    ["typeParam", $.nCompact],
  ],
  [
    TypeKind.SizedArray,
    ["len", $.u32],
    ["typeParam", $.nCompact],
  ],
  [
    TypeKind.Tuple,
    ["fields", $.array($.nCompact)],
  ],
  [
    TypeKind.Primitive,
    ["kind", $primitiveKind],
  ],
  [
    TypeKind.Compact,
    ["typeParam", $.nCompact],
  ],
  [
    TypeKind.BitSequence,
    ["bitOrderType", $.nCompact],
    ["bitStoreType", $.nCompact],
  ],
);

export interface Param {
  name: string;
  type: number | undefined;
}
export const $param: $.Codec<Param> = $.object(
  ["name", $.str],
  ["type", $.option($.nCompact)],
);

export type Type = {
  i: number;
  path: string[];
  params: Param[];
  docs: string[];
} & TypeDef;
export const $type: $.Codec<Type> = $.createCodec({
  _staticSize: 0,
  _encode: undefined!,
  _decode(buffer) {
    const i = $.nCompact._decode(buffer);
    const path = $.array($.str)._decode(buffer);
    const params = $.array($param)._decode(buffer);
    const def = $typeDef._decode(buffer);
    const docs = $.array($.str)._decode(buffer);
    return {
      i,
      path,
      params,
      ...def,
      docs,
    };
  },
});

export enum HasherKind {
  Blake2_128 = "Blake2_128",
  Blake2_256 = "Blake2_256",
  Blake2_128Concat = "Blake2_128Concat",
  Twox128 = "Twox128",
  Twox256 = "Twox256",
  Twox64Concat = "Twox64Concat",
  Identity = "Identity",
}
const $hasherKind: $.Codec<HasherKind> = $.keyLiteralUnion(
  HasherKind.Blake2_128,
  HasherKind.Blake2_256,
  HasherKind.Blake2_128Concat,
  HasherKind.Twox128,
  HasherKind.Twox256,
  HasherKind.Twox64Concat,
  HasherKind.Identity,
);

export enum StorageEntryModifier {
  Optional,
  Default,
}
export const $storageEntryModifier = $.u8 as $.Codec<StorageEntryModifier>;

export enum StorageEntryTypeKind {
  Plain,
  Map,
}

export interface PlainStorageEntryType {
  _tag: StorageEntryTypeKind.Plain;
  value: number;
}

export interface MapStorageEntryType {
  _tag: StorageEntryTypeKind.Map;
  hashers: HasherKind[];
  key: number;
  value: number;
}

export type StorageEntryType = PlainStorageEntryType | MapStorageEntryType;

export const $storageEntryType: $.Codec<StorageEntryType> = $.taggedUnion(
  "_tag",
  [StorageEntryTypeKind.Plain, ["value", $.nCompact]],
  [
    StorageEntryTypeKind.Map,
    ["hashers", $.array($hasherKind)],
    ["key", $.nCompact],
    ["value", $.nCompact],
  ],
);

export type StorageEntry = {
  name: string;
  modifier: StorageEntryModifier;
  default: number[];
  docs: string[];
} & StorageEntryType;
export const $storageEntry: $.Codec<StorageEntry> = $.createCodec({
  _staticSize: 0,
  _encode: undefined!,
  _decode(buffer) {
    const name = $.str._decode(buffer);
    const modifier = $storageEntryModifier._decode(buffer);
    const type = $storageEntryType._decode(buffer);
    const default_ = $.array($.u8)._decode(buffer);
    const docs = $.array($.str)._decode(buffer);
    return {
      name,
      modifier,
      ...type,
      default: default_,
      docs,
    };
  },
});

export interface Storage {
  prefix: string;
  entries: StorageEntry[];
}
export const $storage: $.Codec<Storage> = $.object(
  ["prefix", $.str],
  ["entries", $.array($storageEntry)],
);

export interface Constant {
  name: string;
  type: number;
  value: Uint8Array;
  docs: string[];
}
export const $constant: $.Codec<Constant> = $.object(
  ["name", $.str],
  ["type", $.nCompact],
  ["value", $.uint8array],
  ["docs", $.array($.str)],
);

type OptionalTypeBearer = $.Native<typeof optionalTypeBearer>;
const optionalTypeBearer = $.option($.object(["type", $.nCompact]));

export interface Pallet {
  name: string;
  storage: Storage | undefined;
  calls: OptionalTypeBearer;
  event: OptionalTypeBearer;
  constants: Constant[];
  error: OptionalTypeBearer;
  i: number;
}
export const $pallet: $.Codec<Pallet> = $.object(
  ["name", $.str],
  ["storage", $.option($storage)],
  ["calls", optionalTypeBearer],
  ["event", optionalTypeBearer],
  ["constants", $.array($constant)],
  ["error", optionalTypeBearer],
  ["i", $.u8],
);

export interface SignedExtensionMetadata {
  ident: string;
  type: number;
  additionalSigned: number | bigint;
}
export const $signedExtensionMetadata: $.Codec<SignedExtensionMetadata> = $.object(
  ["ident", $.str],
  ["type", $.nCompact],
  ["additionalSigned", $.compact],
);

export interface Extrinsic {
  type: number;
  version: number;
  signedExtensions: SignedExtensionMetadata[];
}
export const $extrinsic: $.Codec<Extrinsic> = $.object(
  ["type", $.nCompact],
  ["version", $.u8],
  ["signedExtensions", $.array($signedExtensionMetadata)],
);

export interface Metadata {
  version: 14;
  types: Type[];
  pallets: Pallet[];
  extrinsic: Extrinsic;
}
export const $metadata: $.Codec<Metadata> = $.object(
  ["version", $.u8 as $.Codec<14>],
  ["types", $.array($type)],
  ["pallets", $.array($pallet)],
  ["extrinsic", $extrinsic],
);

export const $prefixedMetadata = $.createCodec({
  _staticSize: 0,
  _encode: undefined!,
  _decode(buffer) {
    $.u32._decode(buffer);
    return $metadata._decode(buffer);
  },
});

export const fromPrefixedHex = (scaleEncoded: string): Metadata => {
  return $prefixedMetadata.decode(hex.decode(scaleEncoded));
};
