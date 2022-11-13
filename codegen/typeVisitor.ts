import * as M from "../frame_metadata/mod.ts"
import { CodegenProps } from "./mod.ts"
import { Decl, getName, getPath, makeDocComment, S } from "./utils.ts"

export function createTypeVisitor(props: CodegenProps, decls: Decl[]) {
  const { tys } = props.metadata
  return new M.TyVisitor<string>(tys, {
    unitStruct(ty) {
      addFactoryDecl(ty, "(){ return null }")
      return addTypeDecl(ty, "null")
    },
    wrapperStruct(ty, inner) {
      if (ty.path[0] === "Cow") return this.visit(inner)
      const type = addTypeDecl(ty, this.visit(inner))
      addFactoryDecl(ty, `(value: ${type}){ return value }`)
      return type
    },
    tupleStruct(ty, members) {
      const type = addTypeDecl(ty, S.array(members.map((x) => this.visit(x))))
      addFactoryDecl(ty, `(...value: ${type}){ return value }`)
      return type
    },
    objectStruct(ty) {
      const type = addInterfaceDecl(
        ty,
        S.object(
          ...ty.fields.map(
            (x) => [makeDocComment(x.docs), x.name!, this.visit(x.ty)] as const,
          ),
        ),
      )
      addFactoryDecl(ty, `(value: ${type}){ return value }`)
      return type
    },
    option(_ty, some) {
      return `${this.visit(some)} | undefined`
    },
    result(_ty, ok, err) {
      return `${this.visit(ok)} | C.ChainError<${this.visit(err)}>`
    },
    never(ty) {
      return addTypeDecl(ty, "never")
    },
    stringUnion(ty) {
      return addTypeDecl(ty, ty.members.map((x) => S.string(x.name)).join(" | "))
    },
    taggedUnion(ty) {
      const path = getPath(tys, ty)!
      const name = getName(path)
      const factories: string[] = []
      const types: string[] = []
      const union: string[] = []
      for (const { fields, name: type, docs } of ty.members) {
        const memberPath = path + "." + type
        let props: [comment: string, name: string, type: string][]
        let factory: [params: string, result: string]
        if (fields.length === 0) {
          props = []
          factory = ["", ""]
        } else if (fields[0]!.name === undefined) {
          // Tuple variant
          const value = fields.length === 1
            ? this.visit(fields[0]!.ty)
            : S.array(fields.map((f) => this.visit(f.ty)))
          props = [["", "value", value]]
          factory = [
            `${fields.length === 1 ? "" : "..."}value: t.${memberPath}["value"]`,
            "value",
          ]
        } else {
          // Object variant
          props = fields.map((field, i) => [
            makeDocComment(field.docs),
            `${field.name || i}`,
            this.visit(field.ty),
          ])
          factory = [`value: Omit<t.${memberPath}, "type">`, "...value"]
        }
        factories.push(
          makeDocComment(docs)
            + `export function ${type} (${factory[0]}): t.${memberPath}`
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
        union.push(`| t.${memberPath}`)
      }
      decls.push({
        path,
        code: makeDocComment(ty.docs)
          + `export type ${name} = ${union.join(" ")}\n`
          + `export namespace ${name} { ${
            [
              ...types,
              ...factories,
            ].join("\n")
          } }`,
      })
      return "t." + path
    },
    uint8Array(ty) {
      return addTypeDecl(ty, "Uint8Array")
    },
    array(ty) {
      return addTypeDecl(ty, `Array<${this.visit(ty.typeParam)}>`)
    },
    sizedUint8Array(ty) {
      return addTypeDecl(ty, "Uint8Array") // TODO: consider `& { length: L }`
    },
    sizedArray(ty) {
      return addTypeDecl(ty, S.array(Array(ty.len).fill(this.visit(ty.typeParam))))
    },
    primitive(ty) {
      if (ty.kind === "char") return addTypeDecl(ty, "string")
      if (ty.kind === "bool") return "boolean"
      if (ty.kind === "str") return "string"
      if (+ty.kind.slice(1) < 64) return addTypeDecl(ty, "number")
      return addTypeDecl(ty, "bigint")
    },
    compact(ty) {
      decls.push({ path: "Compact", code: "export type Compact<T> = T" })
      return `t.Compact<${this.visit(ty.typeParam)}>`
    },
    bitSequence(ty) {
      return addTypeDecl(ty, "$.BitSequence")
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
      const path = getPath(tys, ty)
      if (path) return "t." + path
      return this._visit(ty)
    },
  })

  function addTypeDecl(ty: M.Ty, value: string) {
    const path = getPath(tys, ty)
    if (path && path !== value) {
      decls.push({
        path,
        code: makeDocComment(ty.docs) + `export type ${getName(path)} = ${value}`,
      })
    }
    return path ? "t." + path : value
  }

  function addInterfaceDecl(ty: M.Ty, value: string) {
    const path = getPath(tys, ty)
    if (path && path !== value) {
      decls.push({
        path,
        code: makeDocComment(ty.docs) + `export interface ${getName(path)} ${value}`,
      })
    }
    return path ? "t." + path : value
  }

  function addFactoryDecl(ty: M.Ty, body: string) {
    const path = getPath(tys, ty)
    if (path) {
      decls.push({
        path,
        code: makeDocComment(ty.docs) + `export function ${getName(path)} ${body}`,
      })
    }
  }
}
