import { Tagged } from "/_/util/mod.ts";
import * as dp from "/scale/decode-patterns.ts";
import * as d from "/scale/decode.ts";

export type NamedTypeDef = RecordTypeDef | TaggedUnionTypeDef;

// TODO: "As"-ify all compacts that WILL be represented as `number` in TS.
// TODO: should we get rid of all `index` fields, given that they'll be accessible through reflection?

export interface Field {
  name?: string;
  type: number;
  typeName?: string;
  docs: string[];
}
export const field: d.Decoder<Field> = d.Record(
  d.RecordField("name", d.Option(d.str)),
  d.RecordField("type", dp.compactAsNum),
  d.RecordField("typeName", d.Option(d.str)),
  d.RecordField("docs", d.UnknownSizeArray(d.str)),
);

export enum PrimitiveTypeDefKind {
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
export const primitiveTypeDefKind: d.Decoder<PrimitiveTypeDefKind> = d.Union(
  ...([
    PrimitiveTypeDefKind.Bool,
    PrimitiveTypeDefKind.Char,
    PrimitiveTypeDefKind.Str,
    PrimitiveTypeDefKind.U8,
    PrimitiveTypeDefKind.U16,
    PrimitiveTypeDefKind.U32,
    PrimitiveTypeDefKind.U64,
    PrimitiveTypeDefKind.U128,
    PrimitiveTypeDefKind.U256,
    PrimitiveTypeDefKind.I8,
    PrimitiveTypeDefKind.I16,
    PrimitiveTypeDefKind.I32,
    PrimitiveTypeDefKind.I64,
    PrimitiveTypeDefKind.I128,
    PrimitiveTypeDefKind.I256,
  ] as const).map(d.PropertyKeyLiteral),
);

export interface TaggedUnionMember {
  name: string;
  fields: Field[];
  i: number;
  docs: string[];
}
export const taggedUnionMember: d.Decoder<TaggedUnionMember> = d.Record(
  d.RecordField("name", d.str),
  d.RecordField("fields", d.UnknownSizeArray(field)),
  d.RecordField("i", d.u8), // index
  d.RecordField("docs", d.UnknownSizeArray(d.str)),
);

export enum TypeDefKind {
  Record = "Record",
  TaggedUnion = "TaggedUnion",
  Sequence = "Sequence",
  FixedLenArray = "FixedLenArray",
  Tuple = "Tuple",
  Primitive = "Primitive",
  Compact = "Compact",
  BitSequence = "BitSequence",
}
export type TypeDef =
  // TODO: decide whether to make `fields` and `members` optional
  | RecordTypeDef
  | TaggedUnionTypeDef
  | SequenceTypeDef
  | FixedLenArrayTypeDef
  | TupleTypeDef
  | PrimitiveTypeDef
  | CompactTypeDef
  | BitSequenceTypeDef;

export type RecordTypeDef = Tagged<TypeDefKind.Record, { fields: Field[] }>;
export const recordTypeDef: d.Decoder<RecordTypeDef> = dp.Tagged(
  TypeDefKind.Record,
  d.RecordField("fields", d.UnknownSizeArray(field)),
);

export type TaggedUnionTypeDef = Tagged<TypeDefKind.TaggedUnion, { members: TaggedUnionMember[] }>;
export const taggedUnionTypeDef: d.Decoder<TaggedUnionTypeDef> = dp.Tagged(
  TypeDefKind.TaggedUnion,
  d.RecordField("members", d.UnknownSizeArray(taggedUnionMember)),
);

export type SequenceTypeDef = Tagged<TypeDefKind.Sequence, { typeParam: number }>;
export const sequenceTypeDef: d.Decoder<SequenceTypeDef> = dp.Tagged(
  TypeDefKind.Sequence,
  d.RecordField("typeParam", dp.compactAsNum),
);

export type FixedLenArrayTypeDef = Tagged<TypeDefKind.FixedLenArray, {
  len: number;
  typeParam: number;
}>;
export const fixedLenArrayTypeDef: d.Decoder<FixedLenArrayTypeDef> = dp.Tagged(
  TypeDefKind.FixedLenArray,
  d.RecordField("len", d.u32),
  d.RecordField("typeParam", dp.compactAsNum),
);

export type TupleTypeDef = Tagged<TypeDefKind.Tuple, { fields: number[] }>;
export const tupleTypeDef: d.Decoder<TupleTypeDef> = dp.Tagged(
  TypeDefKind.Tuple,
  d.RecordField("fields", d.UnknownSizeArray(d.As<number>(d.compact))),
);

export type PrimitiveTypeDef = Tagged<TypeDefKind.Primitive, { kind: PrimitiveTypeDefKind }>;
export const primitiveTypeDef: d.Decoder<PrimitiveTypeDef> = dp.Tagged(
  TypeDefKind.Primitive,
  d.RecordField("kind", primitiveTypeDefKind),
);

export type CompactTypeDef = Tagged<TypeDefKind.Compact, { typeParam: number }>;
export const compactTypeDef: d.Decoder<CompactTypeDef> = dp.Tagged(
  TypeDefKind.Compact,
  d.RecordField("typeParam", d.As<number>(d.compact)),
);

export type BitSequenceTypeDef = Tagged<TypeDefKind.BitSequence, {
  bitOrderType: number;
  bitStoreType: number;
}>;
export const bitSequenceTypeDef: d.Decoder<BitSequenceTypeDef> = dp.Tagged(
  TypeDefKind.BitSequence,
  // TODO: confirm `As<number>` is correct here
  d.RecordField("bitOrderType", dp.compactAsNum),
  d.RecordField("bitStoreType", dp.compactAsNum),
);
export const typeDef: d.Decoder<TypeDef> = d.Union(
  recordTypeDef,
  taggedUnionTypeDef,
  sequenceTypeDef,
  fixedLenArrayTypeDef,
  tupleTypeDef,
  primitiveTypeDef,
  compactTypeDef,
  bitSequenceTypeDef,
);

export interface Param {
  name: string;
  type?: number;
}
export const param: d.Decoder<Param> = d.Record(
  d.RecordField("name", d.str),
  d.RecordField("type", d.Option(dp.compactAsNum)),
);

export interface Type<Def extends TypeDef = TypeDef> {
  i: number;
  path: string[];
  params: Param[];
  def: Def;
  docs: string[];
}
export const type_: d.Decoder<Type> = d.Record(
  d.RecordField("i", dp.compactAsNum),
  d.RecordField("path", d.UnknownSizeArray(d.str)),
  d.RecordField("params", d.UnknownSizeArray(param)),
  d.RecordField("def", typeDef),
  d.RecordField("docs", d.UnknownSizeArray(d.str)),
);

export enum HasherKind {
  Blake2_128 = "blake2_128",
  Blake2_256 = "blake2_256",
  Blake2_128Concat = "blake2_128Concat",
  Twox128 = "twox128",
  Twox256 = "twox256",
  Twox64Concat = "twox64Concat",
  Identity = "Identity",
}

const storageHasher: d.Decoder<HasherKind> = d.Union(
  d.PropertyKeyLiteral(HasherKind.Blake2_128),
  d.PropertyKeyLiteral(HasherKind.Blake2_256),
  d.PropertyKeyLiteral(HasherKind.Blake2_128Concat),
  d.PropertyKeyLiteral(HasherKind.Twox128),
  d.PropertyKeyLiteral(HasherKind.Twox256),
  d.PropertyKeyLiteral(HasherKind.Twox64Concat),
  d.PropertyKeyLiteral(HasherKind.Identity),
);

export enum StorageEntryModifier {
  Optional,
  Default,
}
export const storageEntryModifier: d.Decoder<StorageEntryModifier> = d.Union(
  d.PropertyKeyLiteral(StorageEntryModifier.Optional),
  d.PropertyKeyLiteral(StorageEntryModifier.Default),
);

export enum StorageEntryTypeKind {
  Plain,
  Map,
}
export type StorageEntryType =
  | Tagged<StorageEntryTypeKind.Plain, { value: number }>
  | Tagged<StorageEntryTypeKind.Map, {
    hashers: HasherKind[];
    key: number;
    value: number;
  }>;
export const storageEntryType: d.Decoder<StorageEntryType> = d.Union(
  dp.Tagged(StorageEntryTypeKind.Plain, d.RecordField("value", dp.compactAsNum)),
  dp.Tagged(
    StorageEntryTypeKind.Map,
    d.RecordField("hashers", d.UnknownSizeArray(storageHasher)),
    d.RecordField("key", dp.compactAsNum),
    d.RecordField("value", dp.compactAsNum),
  ),
);

export interface StorageEntry {
  name: string;
  modifier: StorageEntryModifier;
  type: StorageEntryType;
  default: number[];
  docs: string[];
}
export const storageEntry: d.Decoder<StorageEntry> = d.Record(
  d.RecordField("name", d.str),
  d.RecordField("modifier", storageEntryModifier),
  d.RecordField("type", storageEntryType),
  d.RecordField("default", d.UnknownSizeArray(d.u8)),
  d.RecordField("docs", d.UnknownSizeArray(d.str)),
);

export interface Storage {
  prefix: string;
  entries: StorageEntry[];
}
export const storage: d.Decoder<Storage> = d.Record(
  d.RecordField("prefix", d.str),
  d.RecordField("entries", d.UnknownSizeArray(storageEntry)),
);

export interface Constant {
  name: string;
  type: number;
  value: number[];
  docs: string[];
}
export const constant: d.Decoder<Constant> = d.Record(
  d.RecordField("name", d.str),
  d.RecordField("type", dp.compactAsNum),
  d.RecordField("value", d.UnknownSizeArray(d.u8)),
  d.RecordField("docs", d.UnknownSizeArray(d.str)),
);

export interface TypeBearer {
  type: number;
}
export const typeBearer: d.Decoder<TypeBearer> = d.Record(d.RecordField("type", dp.compactAsNum));

export interface Pallet {
  name: string;
  storage?: Storage;
  calls?: TypeBearer;
  event?: TypeBearer;
  constants: Constant[];
  error?: TypeBearer;
  i: number;
}
export const pallet: d.Decoder<Pallet> = d.Record(
  d.RecordField("name", d.str),
  d.RecordField("storage", d.Option(storage)),
  d.RecordField("calls", d.Option(typeBearer)),
  d.RecordField("event", d.Option(typeBearer)),
  d.RecordField("constants", d.UnknownSizeArray(constant)),
  d.RecordField("error", d.Option(typeBearer)),
  d.RecordField("i", d.u8),
);

export interface SignedExtensionMetadata {
  ident: string;
  type: number;
  additionalSigned: number | bigint;
}
export const signedExtensionMetadata: d.Decoder<SignedExtensionMetadata> = d.Record(
  d.RecordField("ident", d.str),
  d.RecordField("type", dp.compactAsNum),
  d.RecordField("additionalSigned", d.compact),
);

export interface ExtrinsicMetadata {
  type: number;
  version: number;
  signedExtensions: SignedExtensionMetadata[];
}
export const extrinsicMetadata: d.Decoder<ExtrinsicMetadata> = d.Record(
  d.RecordField("type", dp.compactAsNum),
  d.RecordField("version", d.u8),
  d.RecordField("signedExtensions", d.UnknownSizeArray(signedExtensionMetadata)),
);

export type MetadataRawV14 = Tagged<14, {
  types: Type[];
  pallets: Pallet[];
  extrinsic: ExtrinsicMetadata;
}>;
export const metadataRawV14: d.Decoder<MetadataRawV14> = dp.Tagged(
  14,
  d.RecordField("types", d.UnknownSizeArray(type_)),
  d.RecordField("pallets", d.UnknownSizeArray(pallet)),
  d.RecordField("extrinsic", extrinsicMetadata),
);
