import { posix as pathPosix } from "../deps/std/path.ts"
import { Ty, TyVisitor, TyVisitorMethods } from "../reflection/mod.ts"
import { normalizeCase } from "../util/case.ts"
import { getOrInit } from "../util/mod.ts"
import { Files } from "./Files.ts"
import { CodegenProps } from "./mod.ts"
import { makeDocComment, S } from "./utils.ts"

class TypeFile {
  reexports = new Set<string>()
  types = new Map<string, Ty>()
  get ext() {
    return this.reexports.size ? "/mod.ts" : ".ts"
  }
}

export function createTypeVisitor(props: CodegenProps, files: Files) {
  const { tys } = props.metadata
  const paths = new Map<Ty, string | null>()
  const typeFiles = new Map<string, TypeFile>()
  addPath("types.Compact", { type: "Compact" } as Ty)

  const visitor = new TyVisitor<string>(tys, {
    unitStruct(_ty) {
      return "null"
    },
    wrapperStruct(_ty, inner) {
      return this.visit(inner)
    },
    tupleStruct(_ty, members) {
      return S.array(members.map((x) => this.visit(x)))
    },
    objectStruct(ty) {
      return S.object(
        ...ty.fields.map(
          (x) => [makeDocComment(x.docs), normalizeCase(x.name!), this.visit(x.ty)] as const,
        ),
      )
    },
    option(_ty, some) {
      return `${this.visit(some)} | undefined`
    },
    result(_ty, ok, err) {
      return `${this.visit(ok)} | C.ChainError<${this.visit(err)}>`
    },
    never() {
      return "never"
    },
    stringUnion(ty) {
      return ty.members.map((x) => S.string(normalizeCase(x.name))).join(" | ")
    },
    taggedUnion: undefined!,
    uint8Array() {
      return "Uint8Array"
    },
    array(ty) {
      return `Array<${this.visit(ty.typeParam)}>`
    },
    sizedUint8Array() {
      return "Uint8Array" // TODO: consider `& { length: L }`
    },
    sizedArray(ty) {
      return S.array(Array(ty.len).fill(this.visit(ty.typeParam)))
    },
    primitive(ty) {
      if (ty.kind === "char") return "string"
      if (ty.kind === "bool") return "boolean"
      if (ty.kind === "str") return "string"
      if (+ty.kind.slice(1) < 64) return "number"
      return "bigint"
    },
    compact(ty) {
      return `types.Compact<${this.visit(ty.typeParam)}>`
    },
    bitSequence() {
      return "$.BitSequence"
    },
    map(_ty, key, val) {
      return `Map<${this.visit(key)}, ${this.visit(val)}>`
    },
    set(_ty, val) {
      return `Set<${this.visit(val)}>`
    },
    era() {
      return "C.Era"
    },
    lenPrefixedWrapper(_ty, inner) {
      return this.visit(inner)
    },
    circular(ty) {
      return getPath(ty) ?? this._visit(ty)
    },
    all(ty) {
      return getPath(ty) ?? undefined
    },
  })

  for (const ty of tys) {
    visitor.visit(ty)
  }

  for (const [path, typeFile] of typeFiles) {
    const filePath = path + typeFile.ext
    files.set(filePath, () => {
      let file = ""
      if (path !== "types") {
        file += `import type * as types from ${S.string(importPath(filePath, "types/mod.ts"))}\n`
      }
      file += `import * as codecs from ${S.string(importPath(filePath, "codecs.ts"))}\n`
      file += `import { $, C } from ${S.string(importPath(filePath, "capi.ts"))}\n`
      file += "\n"
      for (const reexport of [...typeFile.reexports].sort()) {
        const otherFile = typeFiles.get(path + "/" + reexport)!
        file += `export * as ${reexport} from "./${reexport}${otherFile.ext}"\n`
      }
      file += "\n"
      for (
        const [path, ty] of [...typeFile.types].sort((a, b) =>
          a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0
        )
      ) {
        file += createTypeDecl(path, ty) + "\n\n"
      }
      return file
    })
  }

  return visitor

  function getPath(ty: Ty): string | null {
    return getOrInit(paths, ty, () => {
      if (
        ty.type === "Struct" && ty.fields.length === 1 && ty.params.some((x) => x.ty !== undefined)
      ) {
        return null
      }
      let path = _getPath(ty)
      if (path) {
        path = "types." + path
        addPath(path, ty)
      }
      return path
    })

    function _getPath(ty: Ty): string | null {
      if (ty.type === "Primitive") {
        return (ty.kind === "bool" || ty.kind === "str" ? null : ty.kind)
      }
      if (ty.type === "Compact") {
        return null
      }
      if (
        [
          "Option",
          "Result",
          "Cow",
          "BTreeMap",
          "BTreeSet",
          "Era",
          "WrapperOpaque",
          "WrapperKeepOpaque",
        ].includes(ty.path.at(-1)!)
      ) {
        return null
      }
      const baseName = ty.path.join(".")
      if (!baseName) return null
      return baseName + ty.params.map((p, i) => {
        if (
          p.ty === undefined || tys.every((x) =>
            x.path.length !== ty.path.length
            || !x.path.every((x, i) => x === ty.path[i])
            || x.params[i]!.ty === p.ty
          )
        ) {
          return ""
        }
        const x = _getPath(p.ty)
        if (x === null) throw new Error("was null")
        return ".$$" + x
      }).join("")
    }
  }

  function addPath(path: string, ty: Ty) {
    let pair = split(path.replace(/\./g, "/"))
    if (!pair) throw new Error("addPath called with orphan")
    getOrInit(typeFiles, pair[0], () => new TypeFile()).types.set(path, ty)
    while ((pair = split(pair[0]))) {
      getOrInit(typeFiles, pair[0], () => new TypeFile()).reexports.add(pair[1])
    }

    function split(path: string): [string, string] | null {
      const i = path.lastIndexOf("/")
      if (i === -1) return null
      return [path.slice(0, i), path.slice(i + 1)]
    }
  }

  function createTypeDecl(path: string, ty: Ty) {
    const name = path.slice(path.lastIndexOf(".") + 1)
    const docs = makeDocComment(ty.docs)

    const fallback = (key: keyof TyVisitorMethods<string>) => (...args: any) => {
      return `\
${docs}
export type ${name} = ${(visitor[key] as any)!(...args)}
`
    }

    const codec = ty.type === "Compact" ? "" : `\
export const $${name[0]!.toLowerCase()}${name.slice(1)}: $.Codec<${
      ty.type === "Primitive" ? name : path
    }> = codecs.$${ty.id}
`

    return codec + new TyVisitor<string>(tys, {
      unitStruct() {
        return `\
${docs}
export type ${name} = null
${docs}
export function ${name}(){ return null }
`
      },
      wrapperStruct(ty, inner) {
        return `\
${docs}
export type ${name} = ${visitor.wrapperStruct(ty, inner)}
${docs}
export function ${name}(value: ${path}){ return value }
`
      },
      tupleStruct(ty, members) {
        return `\
${docs}
export type ${name} = ${visitor.tupleStruct(ty, members)}
${docs}
export function ${name}(...value: ${path}){ return value }
`
      },
      objectStruct(ty) {
        return `\
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
          const type = normalizeCase(name)
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
              normalizeCase(field.name!),
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
        return `\
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
}

function importPath(from: string, to: string) {
  let path = pathPosix.relative(pathPosix.dirname("/" + from), "/" + to)
  if (!path.startsWith(".")) path = "./" + path
  return path
}
