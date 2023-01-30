import { Pallet } from "../../frame_metadata/mod.ts"
import { Ty, UnionTyDef } from "../../scale_info/mod.ts"
import { normalizeIdent } from "../../util/case.ts"
import { hex } from "../../util/mod.ts"
import { File } from "../File.ts"
import { getRawCodecPath, makeDocComment, S } from "../util.ts"
import { FrameCodegen } from "./mod.ts"

export function pallet(ctx: FrameCodegen, pallet: Pallet, callTySrc: string) {
  const file = new File()
  const items = [`
    import type * as types from "./types/mod.ts"
    import * as codecs from "./codecs.ts"
    import { $ } from "./capi.ts"
    import * as C from "./capi.ts"
    import { client } from "./client/mod.ts"
  `]
  for (const entry of pallet.storage?.entries ?? []) {
    items.push(
      makeDocComment(entry.docs)
        + `export const ${entry.name} = client.metadata()`
        + `.pallet(${S.string(pallet.name)})`
        + `.storage(${S.string(entry.name)})`
        + `["_asCodegenStorage"](${
          entry.type === "Map"
            ? entry.hashers.length === 1
              ? `$.tuple(${getRawCodecPath(entry.key)})`
              : getRawCodecPath(entry.key)
            : "$.tuple()"
        }, ${getRawCodecPath(entry.value)})`,
    )
  }
  if (pallet.calls) {
    const ty = pallet.calls as Ty & UnionTyDef
    const isStringUnion = ty.members.every((x) => !x.fields.length)
    for (const call of ty.members) {
      const type = normalizeIdent(call.name)
      const typeName = ctx.typeVisitor.visit(ty)! + "." + type
      const [params, data]: [string, string] = call.fields.length
        ? call.fields[0]!.name
          ? [
            `value: C.RunicArgs<X, Omit<${typeName}, "type">>`,
            `{ type: ${S.string(type)}, ...value }`,
          ]
          : call.fields.length > 1
          ? [
            `...value: C.RunicArgs<X, ${typeName}["value"]>`,
            `{ type: ${S.string(type)}, value: C.Rune.tuple(value) }`,
          ]
          : [
            `...[value]: C.RunicArgs<X, [value: ${typeName}["value"]]>`,
            `{ type: ${S.string(type)}, value }`,
          ]
        : [
          "",
          isStringUnion ? S.string(type) : `C.Rune.rec(${S.object(["type", S.string(type)])})`,
        ]
      items.push(
        makeDocComment(call.docs)
          + `export function ${type}<X>(${params}): C.ExtrinsicRune<${callTySrc}, C.RunicArgs.U<X>>`
          + `{ return client.extrinsic(C.Rune.rec({ type: ${
            S.string(pallet.name)
          }, value: C.Rune.rec(${data}) })) }`,
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
  file.codeRaw = items.join("\n\n")
  return file
}
