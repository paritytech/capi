import * as $ from "../deps/scale.ts";
import * as U from "../util/mod.ts";
import { $tyId, $tys, Ty } from "./scale_info.ts";

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
  value: Ty;
}

export interface MapStorageEntryType {
  type: "Map";
  hashers: HasherKind[];
  key: Ty;
  value: Ty;
}

export type StorageEntryType = PlainStorageEntryType | MapStorageEntryType;

export const $storageEntryType: $.Codec<StorageEntryType> = $.taggedUnion("type", [
  ["Plain", ["value", $tyId]],
  [
    "Map",
    ["hashers", $.array($hasherKind)],
    ["key", $tyId],
    ["value", $tyId],
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
  ty: Ty;
  value: Uint8Array;
  docs: string[];
}
export const $constant: $.Codec<Constant> = $.object(
  ["name", $.str],
  ["ty", $tyId],
  ["value", $.uint8Array],
  ["docs", $.array($.str)],
);

export interface Pallet {
  name: string;
  storage: Storage | undefined;
  calls: Ty | undefined;
  event: Ty | undefined;
  constants: Constant[];
  error: Ty | undefined;
  i: number;
}
export const $pallet: $.Codec<Pallet> = $.object(
  ["name", $.str],
  ["storage", $.option($storage)],
  ["calls", $.option($tyId)],
  ["event", $.option($tyId)],
  ["constants", $.array($constant)],
  ["error", $.option($tyId)],
  ["i", $.u8],
);

export interface SignedExtensionMetadata {
  ident: string;
  ty: Ty;
  additionalSigned: Ty;
}
export const $signedExtensionMetadata: $.Codec<SignedExtensionMetadata> = $.object(
  ["ident", $.str],
  ["ty", $tyId],
  ["additionalSigned", $tyId],
);

export interface ExtrinsicDef {
  ty: Ty;
  version: number;
  signedExtensions: SignedExtensionMetadata[];
}
export const $extrinsicDef: $.Codec<ExtrinsicDef> = $.object(
  ["ty", $tyId],
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
  ["tys", $tys],
  ["pallets", $.array($pallet)],
  ["extrinsic", $extrinsicDef],
);

export function fromPrefixedHex(scaleEncoded: string): Metadata {
  return $metadata.decode(U.hex.decode(scaleEncoded as U.Hex));
}

export function getPallet(metadata: Metadata, name: string): Pallet | PalletNotFoundError {
  return metadata.pallets.find((pallet) => pallet.name === name) || new PalletNotFoundError();
}
export class PalletNotFoundError extends Error {
  override readonly name = "PalletNotFoundError";
}

export function getEntry(pallet: Pallet, name: string): StorageEntry | EntryNotFoundError {
  return pallet.storage?.entries.find((entry) => entry.name === name) || new EntryNotFoundError();
}
export class EntryNotFoundError extends Error {
  override readonly name = "EntryNotFoundError";
}

export function getConst(pallet: Pallet, name: string): Constant | ConstNotFoundError {
  return pallet.constants?.find((constant) => constant.name === name) || new ConstNotFoundError();
}
export class ConstNotFoundError extends Error {
  override readonly name = "ConstNotFoundError";
}

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
