import { Ty, TyVisitor } from "../../scale_info/mod.ts"
import { normalizeKey } from "../../util/case.ts"
import { getOrInit } from "../../util/mod.ts"
import { makeDocComment, S } from "../util.ts"
import { FrameCodegen, TypeFile } from "./mod.ts"

export function typeVisitor(ctx: FrameCodegen) {
  const { tys } = ctx.metadata
  const paths = new Map<Ty, string | null>()
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
          (x) => [makeDocComment(x.docs), normalizeKey(x.name!), this.visit(x.ty)] as const,
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
      return ty.members.map((x) => S.string(normalizeKey(x.name))).join(" | ")
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
    getOrInit(ctx.typeFiles, pair[0], () => new TypeFile()).types.set(path, ty)
    while ((pair = split(pair[0]))) {
      getOrInit(ctx.typeFiles, pair[0], () => new TypeFile()).reexports.add(pair[1])
    }

    function split(path: string): [string, string] | null {
      const i = path.lastIndexOf("/")
      if (i === -1) return null
      return [path.slice(0, i), path.slice(i + 1)]
    }
  }
}
