import * as $ from "../deps/scale.ts"
import { $tyId, $tys, Ty } from "../scale_info/Ty.ts"
import * as U from "../util/mod.ts"

export type HasherKind = $.Native<typeof $hasherKind>
const $hasherKind = $.stringUnion([
  "Blake2_128",
  "Blake2_256",
  "Blake2_128Concat",
  "Twox128",
  "Twox256",
  "Twox64Concat",
  "Identity",
])

export type StorageEntryModifier = $.Native<typeof $storageEntryModifier>
export const $storageEntryModifier = $.stringUnion([
  "Optional",
  "Default",
])

export interface PlainStorageEntryType {
  type: "Plain"
  value: Ty
}

export interface MapStorageEntryType {
  type: "Map"
  hashers: HasherKind[]
  key: Ty
  value: Ty
}

export type StorageEntryType = PlainStorageEntryType | MapStorageEntryType

export const $storageEntryType: $.Codec<StorageEntryType> = $.taggedUnion("type", [
  $.variant("Plain", $.field("value", $tyId)),
  $.variant(
    "Map",
    $.field("hashers", $.array($hasherKind)),
    $.field("key", $tyId),
    $.field("value", $tyId),
  ),
])

export type StorageEntry = {
  name: string
  modifier: StorageEntryModifier
  default: Uint8Array
  docs: string[]
} & StorageEntryType

export const $storageEntry: $.Codec<StorageEntry> = $.object(
  $.object(
    $.object(
      $.field("name", $.str),
      $.field("modifier", $storageEntryModifier),
    ),
    $storageEntryType,
  ),
  $.object(
    $.field("default", $.uint8Array),
    $.field("docs", $.array($.str)),
  ),
)

export interface Storage {
  prefix: string
  entries: StorageEntry[]
}
export const $storage: $.Codec<Storage> = $.object(
  $.field("prefix", $.str),
  $.field("entries", $.array($storageEntry)),
)

export interface Constant {
  name: string
  ty: Ty
  value: Uint8Array
  docs: string[]
}
export const $constant: $.Codec<Constant> = $.object(
  $.field("name", $.str),
  $.field("ty", $tyId),
  $.field("value", $.uint8Array),
  $.field("docs", $.array($.str)),
)

export interface Pallet {
  name: string
  storage?: Storage
  calls?: Ty
  event?: Ty
  constants: Constant[]
  error?: Ty
  i: number
}
export const $pallet: $.Codec<Pallet> = $.object(
  $.field("name", $.str),
  $.optionalField("storage", $storage),
  $.optionalField("calls", $tyId),
  $.optionalField("event", $tyId),
  $.field("constants", $.array($constant)),
  $.optionalField("error", $tyId),
  $.field("i", $.u8),
)

export interface SignedExtensionMetadata {
  ident: string
  ty: Ty
  additionalSigned: Ty
}
export const $signedExtensionMetadata: $.Codec<SignedExtensionMetadata> = $.object(
  $.field("ident", $.str),
  $.field("ty", $tyId),
  $.field("additionalSigned", $tyId),
)

export interface ExtrinsicDef {
  ty: Ty
  version: number
  signedExtensions: SignedExtensionMetadata[]
}
export const $extrinsicDef: $.Codec<ExtrinsicDef> = $.object(
  $.field("ty", $tyId),
  $.field("version", $.u8),
  $.field("signedExtensions", $.array($signedExtensionMetadata)),
)

// https://docs.substrate.io/build/application-development/#metadata-system
export const magicNumber = 1635018093

export interface Metadata {
  magicNumber: typeof magicNumber
  version: 14
  tys: Ty[]
  pallets: Pallet[]
  extrinsic: ExtrinsicDef
}
export const $metadata: $.Codec<Metadata> = $.object(
  $.field("magicNumber", $.constant<typeof magicNumber>(magicNumber, $.u32)),
  $.field("version", $.constant<14>(14, $.u8)),
  $.field("tys", $tys),
  $.field("pallets", $.array($pallet)),
  $.field("extrinsic", $extrinsicDef),
)

export function fromPrefixedHex(scaleEncoded: string): Metadata {
  return $metadata.decode(U.hex.decode(scaleEncoded as U.Hex))
}

export function getPallet(metadata: Metadata, name: string): Pallet | PalletNotFoundError {
  return metadata.pallets.find((pallet) => pallet.name === name) || new PalletNotFoundError()
}
export class PalletNotFoundError extends Error {
  override readonly name = "PalletNotFoundError"
}

export function getEntry(pallet: Pallet, name: string): StorageEntry | EntryNotFoundError {
  return pallet.storage?.entries.find((entry) => entry.name === name) || new EntryNotFoundError()
}
export class EntryNotFoundError extends Error {
  override readonly name = "EntryNotFoundError"
}

export function getConst(pallet: Pallet, name: string): Constant | ConstNotFoundError {
  return pallet.constants?.find((constant) => constant.name === name) || new ConstNotFoundError()
}
export class ConstNotFoundError extends Error {
  override readonly name = "ConstNotFoundError"
}

export function getPalletAndEntry(
  metadata: Metadata,
  palletName: string,
  entryName: string,
): [Pallet, StorageEntry] | PalletNotFoundError | EntryNotFoundError {
  const pallet = getPallet(metadata, palletName)
  if (pallet instanceof Error) {
    return pallet
  }
  const entry = getEntry(pallet, entryName)
  if (entry instanceof Error) {
    return entry
  }
  return [pallet, entry]
}
