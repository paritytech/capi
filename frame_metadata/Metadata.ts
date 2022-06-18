import * as $ from "../_deps/scale.ts";
import * as hex from "../util/hex.ts";

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
  i: number;
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
        ["i", $.u8],
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
  i: number;
  path: string[];
  params: Param[];
  docs: string[];
} & TyDef;
export const $ty: $.Codec<Ty> = $.spread(
  $.spread(
    $.object(
      ["i", $.nCompact],
      ["path", $.array($.str)],
      ["params", $.array($param)],
    ),
    $tyDef,
  ),
  $.object(
    ["docs", $.array($.str)],
  ),
);

export type HasherKind = $.Native<typeof $hasherKind>;
const $hasherKind = $.keyLiteralUnion(
  "Blake2_128",
  "Blake2_256",
  "Blake2_128Concat",
  "Twox128",
  "Twox256",
  "Twox64Concat",
  "Identity",
);

export type StorageEntryModifier = $.Native<typeof $storageEntryModifier>;
export const $storageEntryModifier = $.keyLiteralUnion(
  "Optional",
  "Default",
);

export interface PlainStorageEntryType {
  type: "Plain";
  value: number;
}

export interface MapStorageEntryType {
  type: "Map";
  hashers: HasherKind[];
  key: number;
  value: number;
}

export type StorageEntryType = PlainStorageEntryType | MapStorageEntryType;

export const $storageEntryType: $.Codec<StorageEntryType> = $.taggedUnion(
  "type",
  ["Plain", ["value", $.nCompact]],
  [
    "Map",
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

export const $storageEntry: $.Codec<StorageEntry> = $.spread(
  $.spread(
    $.object(
      ["name", $.str],
      ["modifier", $storageEntryModifier],
    ),
    $storageEntryType,
  ),
  $.object(
    ["default", $.array($.u8)],
    ["docs", $.array($.str)],
  ),
);

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
  ty: number;
  value: Uint8Array;
  docs: string[];
}
export const $constant: $.Codec<Constant> = $.object(
  ["name", $.str],
  ["ty", $.nCompact],
  ["value", $.uint8array],
  ["docs", $.array($.str)],
);

type OptionalTypeBearer = $.Native<typeof optionalTypeBearer>;
const optionalTypeBearer = $.option($.object(["ty", $.nCompact]));

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
  ty: number;
  additionalSigned: number;
}
export const $signedExtensionMetadata: $.Codec<SignedExtensionMetadata> = $.object(
  ["ident", $.str],
  ["ty", $.nCompact],
  ["additionalSigned", $.nCompact],
);

export interface ExtrinsicDef {
  ty: number;
  version: number;
  signedExtensions: SignedExtensionMetadata[];
}
export const $extrinsicDef: $.Codec<ExtrinsicDef> = $.object(
  ["ty", $.nCompact],
  ["version", $.u8],
  ["signedExtensions", $.array($signedExtensionMetadata)],
);

// https://docs.substrate.io/v3/runtime/metadata/#encoded-metadata-format
export const magicNumber = 1635018093;

export interface Metadata {
  magicNumber: typeof magicNumber;
  version: 14;
  tys: Ty[];
  pallets: Pallet[];
  extrinsic: ExtrinsicDef;
}
export const $metadata: $.Codec<Metadata> = $.object(
  ["magicNumber", $.constantPattern(magicNumber, $.u32)],
  ["version", $.constantPattern(14, $.u8)],
  ["tys", $.array($ty)],
  ["pallets", $.array($pallet)],
  ["extrinsic", $extrinsicDef],
);

export function fromPrefixedHex(scaleEncoded: string): Metadata {
  return $metadata.decode(hex.decode(scaleEncoded));
}
