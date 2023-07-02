import {
  blake2_128,
  blake2_128Concat,
  blake2_256,
  identity,
  twox128,
  twox256,
  twox64Concat,
} from "../../crypto/mod.ts"
import * as $ from "../../deps/scale.ts"
import { $ty, $tyId } from "../../scale_info/raw/Ty.ts"
import { $null, transformTys } from "../../scale_info/transformTys.ts"
import { normalizeDocs, normalizeIdent } from "../../util/normalize.ts"
import { FrameMetadata } from "../FrameMetadata.ts"
import {
  $emptyKey,
  $partialEmptyKey,
  $partialMultiKey,
  $partialSingleKey,
  $storageKey,
} from "../key_codecs.ts"

const hashers = {
  blake2_128,
  blake2_256,
  blake2_128Concat,
  twox128,
  twox256,
  twox64Concat,
  identity,
}

const $hasher = $.literalUnion<keyof typeof hashers>([
  "blake2_128",
  "blake2_256",
  "blake2_128Concat",
  "twox128",
  "twox256",
  "twox64Concat",
  "identity",
])

const $storageEntry = $.object(
  $.field("name", $.str),
  $.field("modifier", $.literalUnion(["Optional", "Default"])),
  $.taggedUnion("type", [
    $.variant("Plain", $.field("value", $tyId)),
    $.variant(
      "Map",
      $.field("hashers", $.array($hasher)),
      $.field("key", $tyId),
      $.field("value", $tyId),
    ),
  ]),
  $.field("default", $.uint8Array),
  $.field("docs", $.array($.str)),
)

const $constant = $.object(
  $.field("name", $.str),
  $.field("ty", $tyId),
  $.field("value", $.uint8Array),
  $.field("docs", $.array($.str)),
)

const $pallet = $.object(
  $.field("name", $.str),
  $.optionalField(
    "storage",
    $.object(
      $.field("prefix", $.str),
      $.field("entries", $.array($storageEntry)),
    ),
  ),
  $.optionalField("calls", $tyId),
  $.optionalField("event", $tyId),
  $.field("constants", $.array($constant)),
  $.optionalField("error", $tyId),
  $.field("id", $.u8),
)

const $extrinsicDef = $.object(
  $.field("ty", $tyId),
  $.field("version", $.u8),
  $.field(
    "signedExtensions",
    $.array($.object(
      $.field("ident", $.str),
      $.field("ty", $tyId),
      $.field("additionalSigned", $tyId),
    )),
  ),
)

// https://docs.substrate.io/build/application-development/#metadata-system
const magicNumber = 1635018093

export const $metadata = $.object(
  $.field("magicNumber", $.constant<typeof magicNumber>(magicNumber, $.u32)),
  $.field("version", $.constant<14>(14, $.u8)),
  $.field("tys", $.array($ty)),
  $.field("pallets", $.array($pallet)),
  $.field("extrinsic", $extrinsicDef),
  // TODO: is this useful?
  $.field("runtime", $tyId),
)

export function transformMetadata(metadata: $.Output<typeof $metadata>): FrameMetadata {
  const { ids, types, paths } = transformTys(metadata.tys)
  return {
    types,
    paths,
    pallets: Object.fromEntries(
      metadata.pallets.map((pallet): [string, FrameMetadata.Pallet] => [pallet.name, {
        id: pallet.id,
        name: pallet.name,
        storagePrefix: pallet.storage?.prefix ?? pallet.name,
        storage: Object.fromEntries(
          pallet.storage?.entries.map((storage): [string, FrameMetadata.StorageEntries] => {
            let key, partialKey
            if (storage.type === "Plain") {
              key = $emptyKey
              partialKey = $partialEmptyKey
            } else if (storage.hashers.length === 1) {
              key = hashers[storage.hashers[0]!].$hash(ids[storage.key]!)
              partialKey = $partialSingleKey(key)
            } else {
              const codecs = extractTupleMembersVisitor.visit(ids[storage.key]!).map((codec, i) =>
                hashers[storage.hashers[i]!].$hash(codec)
              )
              key = $.tuple(...codecs)
              partialKey = $partialMultiKey(...codecs)
            }
            return [storage.name, {
              singular: storage.type === "Plain",
              name: storage.name,
              key: $storageKey(pallet.name, storage.name, key),
              partialKey: $storageKey(pallet.name, storage.name, partialKey),
              value: ids[storage.value]!,
              docs: normalizeDocs(storage.docs),
              default: storage.modifier === "Default" ? storage.default : undefined,
            }]
          }) ?? [],
        ),
        constants: Object.fromEntries(
          pallet.constants.map((constant): [string, FrameMetadata.Constant] => [constant.name, {
            name: constant.name,
            codec: ids[constant.ty]!,
            value: constant.value,
            docs: normalizeDocs(constant.docs),
          }]),
        ),
        types: {
          call: ids[pallet.calls!],
          error: ids[pallet.error!],
          event: ids[pallet.event!],
        },
        docs: "",
      }]),
    ),
    extrinsic: {
      call: getExtrinsicParameter("call"),
      signature: getExtrinsicParameter("signature"),
      address: getExtrinsicParameter("address"),
      extra: getExtensionsCodec("ty"),
      additional: getExtensionsCodec("additionalSigned"),
    },
  }
  function getExtrinsicParameter(key: "call" | "signature" | "address") {
    return ids[
      metadata.tys[metadata.extrinsic.ty]!.params.find((x) => x.name.toLowerCase() === key)!.ty!
    ]!
  }
  function getExtensionsCodec(key: "ty" | "additionalSigned") {
    return $.object(...metadata.extrinsic.signedExtensions.flatMap((ext) => {
      const codec = ids[ext[key]]!
      if (codec === $null) return []
      return [$.field(normalizeIdent(ext.ident), codec)]
    }) as any)
  }
}

const extractTupleMembersVisitor = new $.CodecVisitor<$.Codec<any>[]>()
  .add($.tuple<$.Codec<any>[]>, (_codec, ...members) => members)
