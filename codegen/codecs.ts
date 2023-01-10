import { outdent } from "../deps/outdent.ts"
import { Ty, TyVisitor } from "../scale_info/mod.ts"
import { normalizeCase } from "../util/case.ts"
import { CodegenCtx, File } from "./Ctx.ts"
import { S } from "./utils.ts"

export function codecs(ctx: CodegenCtx) {
  const { tys } = ctx.metadata
  const namespaceImports = new Set<string>()

  const file = new File()
  file.code = outdent`
    import { $ } from "./capi.ts"
    import * as C from "./capi.ts"
    import type * as types from "../types/mod.ts"
  `

  const visitor = new TyVisitor<string>(tys, {
    unitStruct(ty) {
      return addCodecDecl(ty, "C.$null")
    },
    wrapperStruct(ty, inner) {
      return addCodecDecl(ty, this.visit(inner))
    },
    tupleStruct(ty, members) {
      return addCodecDecl(ty, `$.tuple(${members.map((x) => this.visit(x)).join(", ")})`)
    },
    objectStruct(ty) {
      return addCodecDecl(
        ty,
        `$.object(${
          ty.fields.map((x) => `$.field(${S.string(normalizeCase(x.name!))}, ${this.visit(x.ty)})`)
            .join(", ")
        })`,
      )
    },
    option(ty, some) {
      return addCodecDecl(ty, `$.option(${this.visit(some)})`)
    },
    result(ty, ok, err) {
      return addCodecDecl(
        ty,
        `$.result(${
          this.visit(ok)
        }, $.instance(C.ChainError<$.Native<typeof $${err.id}>>, $.tuple(${
          this.visit(err)
        }), (x) => [x.value]))`,
      )
    },
    never(ty) {
      return addCodecDecl(ty, "$.never")
    },
    stringUnion(ty) {
      return addCodecDecl(
        ty,
        `$.stringUnion(${
          S.object(
            ...ty.members.map((
              x,
            ): [string, string] => [`${x.index}`, S.string(normalizeCase(x.name))]),
          )
        })`,
      )
    },
    taggedUnion(ty) {
      return addCodecDecl(
        ty,
        `$.taggedUnion("type", ${
          S.object(
            ...ty.members.map(({ fields, name, index }): [string, string] => {
              const type = normalizeCase(name)
              let props: string[]
              if (fields.length === 0) {
                props = []
              } else if (fields[0]!.name === undefined) {
                // Tuple variant
                const value = fields.length === 1
                  ? this.visit(fields[0]!.ty)
                  : `$.tuple(${fields.map((f) => this.visit(f.ty)).join(", ")})`
                props = [`$.field(${S.string("value")}, ${value})`]
              } else {
                // Object variant
                props = fields.map((
                  field,
                ) => `$.field(${S.string(normalizeCase(field.name!))}, ${this.visit(field.ty)})`)
              }
              return [`${index}`, `$.variant(${S.string(type)}, ${props.join(",")})`]
            }),
          )
        })`,
      )
    },
    uint8Array(ty) {
      return addCodecDecl(ty, "$.uint8Array")
    },
    array(ty) {
      return addCodecDecl(ty, `$.array(${this.visit(ty.typeParam)})`)
    },
    sizedUint8Array(ty) {
      return addCodecDecl(ty, `$.sizedUint8Array(${ty.len})`)
    },
    sizedArray(ty) {
      return addCodecDecl(ty, `$.sizedArray(${this.visit(ty.typeParam)}, ${ty.len})`)
    },
    primitive(ty) {
      return addCodecDecl(ty, ty.kind === "char" ? "$.str" : "$." + ty.kind)
    },
    compact(ty) {
      return addCodecDecl(ty, `$.compact(${this.visit(ty.typeParam)})`)
    },
    bitSequence(ty) {
      return addCodecDecl(ty, "$.bitSequence")
    },
    map(ty, key, val) {
      return addCodecDecl(ty, `$.map(${this.visit(key)}, ${this.visit(val)})`)
    },
    set(ty, val) {
      return addCodecDecl(ty, `$.set(${this.visit(val)})`)
    },
    era(ty) {
      return addCodecDecl(ty, "C.$era")
    },
    lenPrefixedWrapper(ty, inner) {
      return addCodecDecl(ty, `$.lenPrefixed(${this.visit(inner)})`)
    },
    circular(ty) {
      return `$.deferred(() => $${ty.id})`
    },
  })

  for (const ty of ctx.metadata.tys) {
    visitor.visit(ty)
  }

  file.code += `export const _all: $.AnyCodec[] = ${
    S.array(ctx.metadata.tys.map((ty) => `$${ty.id}`))
  }`

  return file

  function addCodecDecl(ty: Ty, value: string) {
    if (ty.path.length > 1) namespaceImports.add(ty.path[0]!)
    file.code += `export const $${ty.id}: $.Codec<${ctx.typeVisitor.visit(ty)}> = ${value}\n\n`
    return `$${ty.id}`
  }
}
