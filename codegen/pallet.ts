import { outdent } from "../deps/outdent.ts"
import { Pallet } from "../frame_metadata/mod.ts"
import { hex } from "../mod.ts"
import { Ty, UnionTyDef } from "../scale_info/mod.ts"
import { normalizeCase } from "../util/case.ts"
import { Codegen, File } from "./Ctx.ts"
import { getRawCodecPath, makeDocComment, S } from "./utils.ts"

export function pallet(ctx: Codegen, pallet: Pallet) {
  const file = new File()
  const items = [
    outdent`
      import type * as types from "./types/mod.ts"
      import * as codecs from "./_/codecs.ts"
      import { $ } from "./_/capi.ts"
      import * as C from "./_/capi.ts"
      import { client } from "./_/client.ts"
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
    const ty = pallet.calls as Ty & UnionTyDef
    const isStringUnion = ty.members.every((x) => !x.fields.length)
    for (const call of ty.members) {
      const type = normalizeCase(call.name)
      const typeName = ctx.typeVisitor.visit(ty)! + "." + type
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
          + `export function ${type}(${params}) { return { type: ${
            S.string(pallet.name)
          }, value: ${data} } }`,
      )
    }
  }
  for (const constant of pallet.constants) {
    items.push(
      makeDocComment(constant.docs)
        + `export const ${constant.name}: ${
          ctx.typeVisitor.visit(constant.ty)
        } = codecs.$${constant.ty.id}.decode(C.hex.decode(${
          S.string(hex.encode(constant.value))
        } as C.Hex))`,
    )
    constant.value
  }
  file.code = items.join("\n\n")
  return file
}
