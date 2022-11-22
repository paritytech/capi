import * as M from "../frame_metadata/mod.ts"
import { hex } from "../mod.ts"
import { normalizeCase } from "../util/case.ts"
import { Files } from "./Files.ts"
import { getRawCodecPath, makeDocComment, S } from "./utils.ts"

export function genMetadata(
  metadata: M.Metadata,
  typeVisitor: M.TyVisitor<string>,
  files: Files,
) {
  const { tys, extrinsic, pallets } = metadata

  const isUnitVisitor = new M.TyVisitor<boolean>(tys, {
    unitStruct: () => true,
    wrapperStruct(_, inner) {
      return this.visit(inner)
    },
    tupleStruct: () => false,
    objectStruct: () => false,
    option: () => false,
    result: () => false,
    never: () => false,
    stringUnion: () => false,
    taggedUnion: () => false,
    array: () => false,
    sizedArray: () => false,
    primitive: () => false,
    compact: () => false,
    bitSequence: () => false,
    lenPrefixedWrapper: () => false,
    circular: () => false,
  })

  const {
    signature: signatureTy,
    call: callTy,
    address: addressTy,
  } = Object.fromEntries(
    extrinsic.ty.params.map((x) => [x.name.toLowerCase(), x.ty]),
  )

  for (const pallet of pallets) {
    files.set(`pallets/${pallet.name}.ts`, () => {
      const items = [
        `\
import type * as types from "../types/mod.ts"
import * as codecs from "../codecs.ts"
import { $, C, client } from "../capi.ts"
`,
      ]
      for (const entry of pallet.storage?.entries ?? []) {
        items.push(
          makeDocComment(entry.docs)
            + `export const ${entry.name} = new C.fluent.Storage(${[
              "client",
              S.string(entry.type),
              S.string(entry.modifier),
              S.string(pallet.name),
              S.string(entry.name),
              entry.type === "Map"
                ? entry.hashers.length === 1
                  ? `$.tuple(${getRawCodecPath(entry.key)})`
                  : getRawCodecPath(entry.key)
                : "$.tuple()",
              getRawCodecPath(entry.value),
            ]})`,
        )
      }
      if (pallet.calls) {
        const ty = pallet.calls as M.Ty & M.UnionTyDef
        const isStringUnion = ty.members.every((x) => !x.fields.length)
        for (const call of ty.members) {
          const type = normalizeCase(call.name)
          const typeName = typeVisitor.visit(ty)! + "." + type
          const [params, data]: [string, string] = call.fields.length
            ? call.fields[0]!.name
              ? [`value: Omit<${typeName}, "type">`, `{ ...value, type: ${S.string(type)} }`]
              : [
                `${call.fields.length > 1 ? "..." : ""}value: ${typeName}["value"]`,
                `{ ...value, type: ${S.string(type)} }`,
              ]
            : ["", isStringUnion ? S.string(type) : S.object(["type", S.string(type)])]
          items.push(
            makeDocComment(call.docs)
              + `export function ${type}(${params}): ${typeVisitor.visit(callTy!)}`
              + `{ return { type: ${S.string(pallet.name)}, value: ${data} } }`,
          )
        }
      }
      for (const constant of pallet.constants) {
        items.push(
          makeDocComment(constant.docs)
            + `export const ${constant.name}: ${
              typeVisitor.visit(constant.ty)
            } = codecs.$${constant.ty.id}.decode(C.hex.decode(${
              S.string(hex.encode(constant.value))
            } as C.Hex))`,
        )
        constant.value
      }
      return items.join("\n\n")
    })
  }

  files.set(
    "pallets/mod.ts",
    () =>
      pallets.map((x) => x.name).sort().map((x) => `export * as ${x} from "./${x}.ts"`).join("\n"),
  )

  files.set("extrinsic.ts", () => `
import { $, C, client } from "./capi.ts"
import * as codecs from "./codecs.ts"
import type * as types from "./types/mod.ts"

const _extrinsic = ${
    S.object(
      ["version", `${extrinsic.version}`],
      ["extras", getExtrasCodec(extrinsic.signedExtensions.map((x) => [x.ident, x.ty]))],
      [
        "additional",
        getExtrasCodec(extrinsic.signedExtensions.map((x) => [x.ident, x.additionalSigned])),
      ],
      ["call", getRawCodecPath(callTy!)],
      ["address", getRawCodecPath(addressTy!)],
      ["signature", getRawCodecPath(signatureTy!)],
    )
  }
export const extrinsic = C.extrinsic<typeof client, ${typeVisitor.visit(callTy!)}>(client);
`)

  function getExtrasCodec(xs: [string, M.Ty][]) {
    return S.array(
      xs.filter((x) => !isUnitVisitor.visit(x[1])).map((x) => getRawCodecPath(x[1])),
    )
  }
}
