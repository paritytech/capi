import * as $ from "../deps/scale.ts";
import * as U from "../util/mod.ts";
import { $ty, Ty } from "./scale_info.ts";

export type HasherKind = $.Native<typeof $hasherKind>;
const $hasherKind = $.stringUnion([
  "Blake2_128",
  "Blake2_256",
  "Blake2_128Concat",
  "Twox128",
  "Twox256",
  "Twox64Concat",
  "Identity",
]);

export type StorageEntryModifier = $.Native<typeof $storageEntryModifier>;
export const $storageEntryModifier = $.stringUnion([
  "Optional",
  "Default",
]);

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

export const $storageEntryType: $.Codec<StorageEntryType> = $.taggedUnion("type", [
  ["Plain", ["value", $.nCompact]],
  [
    "Map",
    ["hashers", $.array($hasherKind)],
    ["key", $.nCompact],
    ["value", $.nCompact],
  ],
]);

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
  return $metadata.decode(U.hex.decode(scaleEncoded));
}

export function getPallet(metadata: Metadata, name: string): Pallet | PalletNotFoundError {
  return metadata.pallets.find((pallet) => pallet.name === name) || new PalletNotFoundError();
}
export class PalletNotFoundError extends U.ErrorCtor("PalletNotFound") {}

export function getEntry(pallet: Pallet, name: string): StorageEntry | EntryNotFoundError {
  return pallet.storage?.entries.find((entry) => entry.name === name) || new EntryNotFoundError();
}
export class EntryNotFoundError extends U.ErrorCtor("EntryNotFound") {}

export function getPalletAndEntry(
  metadata: Metadata,
  palletName: string,
  entryName: string,
): [Pallet, StorageEntry] | PalletNotFoundError | EntryNotFoundError {
  const pallet = getPallet(metadata, palletName);
  if (pallet instanceof Error) {
    return pallet;
  }
  const entry = getEntry(pallet, entryName);
  if (entry instanceof Error) {
    return entry;
  }
  return [pallet, entry];
}
