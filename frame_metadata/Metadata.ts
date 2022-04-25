import * as hex from "https://deno.land/std@0.136.0/encoding/hex.ts";
import * as s from "x/scale/mod.ts";
import { ValidateCodecSignature } from "./test-util.ts";

export interface Field {
  name: string | undefined;
  type: number;
  typeName: string | undefined;
  docs: string[];
}
export const field = s.record(
  ["name", s.option(s.str)],
  ["type", s.nCompact],
  ["typeName", s.option(s.str)],
  ["docs", s.array(s.str)],
);
type _FieldValidity = ValidateCodecSignature<Field, typeof field, true>;

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
const primitiveKind = s.keyLiteralUnion(
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
type _PrimitiveKindValidity = ValidateCodecSignature<PrimitiveKind, typeof primitiveKind, true>;

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
export interface UnionTypeDef {
  _tag: TypeKind.Union;
  members: {
    name: string;
    fields: Field[];
    i: number;
    docs: string[];
  }[];
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
export const typeDef = s.taggedUnion(
  "_tag",
  [
    TypeKind.Struct,
    ["fields", s.array(field)],
  ],
  [
    TypeKind.Union,
    [
      "members",
      s.array(s.record(
        ["name", s.str],
        ["fields", s.array(field)],
        ["i", s.u8],
        ["docs", s.array(s.str)],
      )),
    ],
  ],
  [
    TypeKind.Sequence,
    ["typeParam", s.nCompact],
  ],
  [
    TypeKind.SizedArray,
    ["len", s.u32],
    ["typeParam", s.nCompact],
  ],
  [
    TypeKind.Tuple,
    ["fields", s.array(s.nCompact)],
  ],
  [
    TypeKind.Primitive,
    ["kind", primitiveKind],
  ],
  [
    TypeKind.Compact,
    ["typeParam", s.nCompact],
  ],
  [
    TypeKind.BitSequence,
    ["bitOrderType", s.nCompact],
    ["bitStoreType", s.nCompact],
  ],
);
type _TypeDefValidity = ValidateCodecSignature<TypeDef, typeof typeDef, true>;

export interface Param {
  name: string;
  type: number | undefined;
}
export const param = s.record(
  ["name", s.str],
  ["type", s.option(s.nCompact)],
);
type _ParamValidity = ValidateCodecSignature<Param, typeof param, true>;

export type Type = {
  i: number;
  path: string[];
  params: Param[];
  docs: string[];
} & TypeDef;
export const type_ = new s.Codec(undefined as any, undefined as any, (cursor) => {
  const i = s.nCompact._d(cursor);
  const path = s.array(s.str)._d(cursor);
  const params = s.array(param)._d(cursor);
  const def = typeDef._d(cursor);
  const docs = s.array(s.str)._d(cursor);
  return {
    i,
    path,
    params,
    ...def,
    docs,
  };
});
type _TypeValidity = ValidateCodecSignature<Type, typeof type_, true>;

export enum HasherKind {
  Blake2_128 = "Blake2_128",
  Blake2_256 = "Blake2_256",
  Blake2_128Concat = "Blake2_128Concat",
  Twox128 = "Twox128",
  Twox256 = "Twox256",
  Twox64Concat = "Twox64Concat",
  Identity = "Identity",
}
const hasherKind = s.keyLiteralUnion(
  HasherKind.Blake2_128,
  HasherKind.Blake2_256,
  HasherKind.Blake2_128Concat,
  HasherKind.Twox128,
  HasherKind.Twox256,
  HasherKind.Twox64Concat,
  HasherKind.Identity,
);
type _HasherKindValidity = ValidateCodecSignature<HasherKind, typeof hasherKind, true>;

export enum StorageEntryModifier {
  Optional,
  Default,
}
export const storageEntryModifier = s.orderedNumEnum(StorageEntryModifier);
type _StorageEntryModifierValidity = ValidateCodecSignature<StorageEntryModifier, typeof storageEntryModifier, true>;

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

export const storageEntryType = s.taggedUnion(
  "_tag",
  [StorageEntryTypeKind.Plain, ["value", s.nCompact]],
  [
    StorageEntryTypeKind.Map,
    ["hashers", s.array(hasherKind)],
    ["key", s.nCompact],
    ["value", s.nCompact],
  ],
);
type _StorageEntryTypeValidity = ValidateCodecSignature<StorageEntryType, typeof storageEntryType, true>;

export type StorageEntry = {
  name: string;
  modifier: StorageEntryModifier;
  default: number[];
  docs: string[];
} & StorageEntryType;
export const storageEntry = new s.Codec(
  undefined as any,
  undefined as any,
  (cursor) => {
    const name = s.str._d(cursor);
    const modifier = storageEntryModifier._d(cursor);
    const type = storageEntryType._d(cursor);
    const default_ = s.array(s.u8)._d(cursor);
    const docs = s.array(s.str)._d(cursor);
    return {
      name,
      modifier,
      ...type,
      default: default_,
      docs,
    };
  },
);
type _StorageEntryValidity = ValidateCodecSignature<StorageEntry, typeof storageEntry, true>;

export interface Storage {
  prefix: string;
  entries: StorageEntry[];
}
export const storage = s.record(
  ["prefix", s.str],
  ["entries", s.array(storageEntry)],
);
type _StorageValidity = ValidateCodecSignature<Storage, typeof storage, true>;

export interface Constant {
  name: string;
  type: number;
  value: number[];
  docs: string[];
}
export const constant = s.record(
  ["name", s.str],
  ["type", s.nCompact],
  ["value", s.array(s.u8)],
  ["docs", s.array(s.str)],
);
type _ConstantValidity = ValidateCodecSignature<Constant, typeof constant, true>;

type OptionalTypeBearer = undefined | { type: number };
const optionalTypeBearer = s.option(s.record(["type", s.nCompact]));
type _OptionalTypeBearerValidity = ValidateCodecSignature<OptionalTypeBearer, typeof optionalTypeBearer, true>;

export interface Pallet {
  name: string;
  storage: Storage | undefined;
  calls: OptionalTypeBearer;
  event: OptionalTypeBearer;
  constants: Constant[];
  error: OptionalTypeBearer;
  i: number;
}
export const pallet = s.record(
  ["name", s.str],
  ["storage", s.option(storage)],
  ["calls", optionalTypeBearer],
  ["event", optionalTypeBearer],
  ["constants", s.array(constant)],
  ["error", optionalTypeBearer],
  ["i", s.u8],
);
type _PalletValidity = ValidateCodecSignature<Pallet, typeof pallet, true>;

export interface SignedExtensionMetadata {
  ident: string;
  type: number;
  additionalSigned: number | bigint;
}
export const signedExtensionMetadata = s.record(
  ["ident", s.str],
  ["type", s.nCompact],
  ["additionalSigned", s.compact],
);
type _SignedExtensionMetadataValidity = ValidateCodecSignature<
  SignedExtensionMetadata,
  typeof signedExtensionMetadata,
  true
>;

export interface Extrinsic {
  type: number;
  version: number;
  signedExtensions: SignedExtensionMetadata[];
}
export const extrinsic = s.record(
  ["type", s.nCompact],
  ["version", s.u8],
  ["signedExtensions", s.array(signedExtensionMetadata)],
);
type _ExtrinsicValidity = ValidateCodecSignature<Extrinsic, typeof extrinsic, true>;

export interface Metadata {
  version: 14;
  types: Type[];
  pallets: Pallet[];
  extrinsic: Extrinsic;
}
export const metadata: s.Codec<Metadata> = s.record(
  ["version", s.u8 as s.Codec<14>],
  ["types", s.array(type_)],
  ["pallets", s.array(pallet)],
  ["extrinsic", extrinsic],
);
type _MetadataV14Validity = ValidateCodecSignature<Metadata, typeof metadata, true>;

export const fromPrefixedHex = (scaleEncoded: string): Metadata => {
  const scaleBytes = hex.decode(new TextEncoder().encode(scaleEncoded.substring(10)));
  return metadata.decode(scaleBytes);
};
