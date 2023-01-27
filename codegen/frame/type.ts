import { posix as pathPosix } from "../../deps/std/path.ts"
import { Ty, TyVisitor, TyVisitorMethods } from "../../scale_info/mod.ts"
import { normalizeIdent } from "../../util/case.ts"
import { File } from "../File.ts"
import { makeDocComment, S } from "../util.ts"
import { FrameCodegen, TypeFile } from "./mod.ts"

function importPath(from: string, to: string) {
  let path = pathPosix.relative(pathPosix.dirname("/" + from), "/" + to)
  if (!path.startsWith(".")) path = "./" + path
  return path
}

export function type(ctx: FrameCodegen, path: string, filePath: string, typeFile: TypeFile) {
  const file = new File()
  if (path !== "types") {
    file.codeRaw += `import type * as types from ${
      S.string(importPath(filePath, "types/mod.ts"))
    }\n`
  }
  file.codeRaw += `import * as codecs from ${S.string(importPath(filePath, "codecs.ts"))}\n`
  file.codeRaw += `import { $ } from ${S.string(importPath(filePath, "capi.ts"))}\n`
  file.codeRaw += `import * as C from ${S.string(importPath(filePath, "capi.ts"))}\n`
  file.codeRaw += "\n"
  for (const reexport of [...typeFile.reexports].sort()) {
    const otherFile = ctx.typeFiles.get(path + "/" + reexport)!
    file.codeRaw += `export * as ${reexport} from "./${reexport}${otherFile.ext}"\n`
  }
  file.codeRaw += "\n"
  for (
    const [path, ty] of [...typeFile.types].sort((a, b) => a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0)
  ) {
    file.codeRaw += createTypeDecl(ctx, ctx.typeVisitor, path, ty) + "\n\n"
  }
  return file
}

function createTypeDecl(ctx: FrameCodegen, visitor: TyVisitor<string>, path: string, ty: Ty) {
  const name = path.slice(path.lastIndexOf(".") + 1)
  const docs = makeDocComment(ty.docs)

  const fallback = (key: keyof TyVisitorMethods<string>) => (...args: any) => {
    return `
      ${docs}
      export type ${name} = ${(visitor[key] as any)!(...args)}
    `
  }

  const codec = ty.type === "Compact" ? "" : `
    export const $${name[0]!.toLowerCase()}${name.slice(1)}: $.Codec<${
    ty.type === "Primitive" ? name : path
  }> = codecs.$${ty.id}
  `

  return codec + new TyVisitor<string>(ctx.metadata.tys, {
    unitStruct() {
      return `
        ${docs}
        export type ${name} = null
        ${docs}
        export function ${name}(){ return null }
      `
    },
    wrapperStruct(ty, inner) {
      return `
        ${docs}
        export type ${name} = ${visitor.wrapperStruct(ty, inner)}
        ${docs}
        export function ${name}(value: ${path}){ return value }
      `
    },
    tupleStruct(ty, members) {
      return `
        ${docs}
        export type ${name} = ${visitor.tupleStruct(ty, members)}
        ${docs}
        export function ${name}(...value: ${path}){ return value }
      `
    },
    objectStruct(ty) {
      return `
        ${docs}
        export interface ${name} ${visitor.objectStruct(ty)}
        ${docs}
        export function ${name}(value: ${path}){ return value }
      `
    },
    option: null!,
    result: null!,
    never: fallback("never"),
    stringUnion: fallback("stringUnion"),
    taggedUnion(ty) {
      const factories: string[] = []
      const types: string[] = []
      const union: string[] = []
      for (const { fields, name, docs } of ty.members) {
        const type = normalizeIdent(name)
        const memberPath = path + "." + type
        let props: [comment: string, name: string, type: string][]
        let factory: [params: string, result: string]
        if (fields.length === 0) {
          props = []
          factory = ["", ""]
        } else if (fields[0]!.name === undefined) {
          // Tuple variant
          const value = fields.length === 1
            ? visitor.visit(fields[0]!.ty)
            : S.array(fields.map((f) => visitor.visit(f.ty)))
          props = [["", "value", value]]
          factory = [
            `${fields.length === 1 ? "" : "..."}value: ${memberPath}["value"]`,
            "value",
          ]
        } else {
          // Object variant
          props = fields.map((field) => [
            makeDocComment(field.docs),
            normalizeIdent(field.name!),
            visitor.visit(field.ty),
          ])
          factory = [`value: Omit<${memberPath}, "type">`, "...value"]
        }
        factories.push(
          makeDocComment(docs)
            + `export function ${type} (${factory[0]}): ${memberPath}`
            + `{ return { type: ${S.string(type)}, ${factory[1]} } }`,
        )
        types.push(
          makeDocComment(docs)
            + `export interface ${type}`
            + S.object(
              ["type", S.string(type)],
              ...props,
            ),
        )
        union.push(`| ${memberPath}`)
      }
      return `
        ${docs}
        export type ${name} = ${union.join(" ")}
        export namespace ${name} { ${
        [
          ...types,
          ...factories,
        ].join("\n")
      } }
      `
    },
    uint8Array: fallback("uint8Array"),
    array: fallback("array"),
    sizedUint8Array: fallback("sizedUint8Array"),
    sizedArray: fallback("sizedArray"),
    primitive: fallback("primitive"),
    compact() {
      return `export type Compact<T> = T\n`
    },
    bitSequence: fallback("bitSequence"),
    map: fallback("map"),
    set: fallback("set"),
    era: null!,
    lenPrefixedWrapper: null!,
    circular: null!,
  }).visit(ty).trim()
}