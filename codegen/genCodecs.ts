import * as M from "../frame_metadata/mod.ts"
import { Files } from "./Files.ts"
import { CodegenProps } from "./mod.ts"
import { Decl, getCodecPath, getName, getRawCodecPath, S } from "./utils.ts"

export function genCodecs(
  props: CodegenProps,
  decls: Decl[],
  typeVisitor: M.TyVisitor<string>,
  files: Files,
) {
  const { tys } = props.metadata
  const namespaceImports = new Set<string>()

  let file = `\
import { $, C } from "./capi.ts"
import type * as t from "./mod.ts"

`

  const visitor = new M.TyVisitor<string>(tys, {
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
          ty.fields.map((x) => S.array([S.string(x.name!), this.visit(x.ty)])).join(", ")
        })`,
      )
    },
    option(ty, some) {
      return addCodecDecl(ty, `$.option(${this.visit(some)})`)
    },
    result(ty, ok, err) {
      return addCodecDecl(
        ty,
        `$.result(${this.visit(ok)}, $.instance(C.ChainError<${
          typeVisitor.visit(err)
        }>, ["value", ${this.visit(err)}]))`,
      )
    },
    never(ty) {
      return addCodecDecl(ty, "$.never")
    },
    stringUnion(ty) {
      return addCodecDecl(
        ty,
        `$.stringUnion(${
          S.object(...ty.members.map((x): [string, string] => [`${x.index}`, S.string(x.name)]))
        })`,
      )
    },
    taggedUnion(ty) {
      return addCodecDecl(
        ty,
        `$.taggedUnion("type", ${
          S.object(
            ...ty.members.map(({ fields, name: type, index }): [string, string] => {
              let props: string[]
              if (fields.length === 0) {
                props = []
              } else if (fields[0]!.name === undefined) {
                // Tuple variant
                const value = fields.length === 1
                  ? this.visit(fields[0]!.ty)
                  : `$.tuple(${fields.map((f) => this.visit(f.ty)).join(", ")})`
                props = [S.array([S.string("value"), value])]
              } else {
                // Object variant
                props = fields.map((field) =>
                  S.array([
                    S.string(field.name!),
                    this.visit(field.ty),
                  ])
                )
              }
              return [`${index}`, S.array([S.string(type), ...props])]
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
      return addCodecDecl(ty, getCodecPath(tys, ty)!)
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
      return `$.deferred(() => ${getName(getRawCodecPath(ty))})`
    },
  })

  for (const ty of props.metadata.tys) {
    visitor.visit(ty)
  }

  file += `export const _all: $.AnyCodec[] = ${
    S.array(props.metadata.tys.map((ty) => getName(getRawCodecPath(ty))))
  }`

  files.set("codecs.ts", file)

  function addCodecDecl(ty: M.Ty, value: string) {
    const rawPath = getRawCodecPath(ty)
    if (ty.path.length > 1) {
      namespaceImports.add(ty.path[0]!)
    }
    file += `export const ${getName(rawPath)}: $.Codec<${typeVisitor.visit(ty)}> = ${value}\n\n`
    const path = getCodecPath(tys, ty)
    // Deduplicate -- metadata has redundant entries (e.g. pallet_collective::RawOrigin)
    if (path !== rawPath && path !== value && !decls.some((x) => x.path === path)) {
      decls.push({
        path,
        code: `export const ${getName(path)}: $.Codec<${typeVisitor.visit(ty)}> = ${rawPath}`,
      })
    }
    return getName(rawPath)
  }
}
