import * as $ from "../deps/scale.ts"
import { Codec } from "../deps/scale.ts"
import { getOrInit } from "../util/mod.ts"
import { normalizeDocs, normalizeIdent, normalizeTypeName } from "../util/normalize.ts"
import { overrides } from "./overrides/mod.ts"
import { $field, Ty } from "./raw/Ty.ts"

/**
 * All derived codecs for ZSTs will use this exact codec,
 * so `derivedCodec === $null` is true iff the type is a ZST.
 */
export const $null = $.withMetadata($.metadata("$null"), $.constant(null))

export function transformTys(tys: Ty[]): [Codec<any>[], Record<string, Codec<any>>] {
  const memo = new Map<number, Codec<any>>()
  const paths: Record<string, Codec<any>> = {}
  const seenPaths = new Map<string, Ty | null>()
  const includePaths = new Set<string>()
  const names = new Map<string, string>()
  const nameCounts = new Map<string, Map<string, number>>()

  for (const ty of tys) {
    const path = ty.path.join("::")
    if (!path) continue
    const last = seenPaths.get(path)
    if (last !== undefined) {
      if (last === null || !eqTy(tys, last.id, ty.id)) {
        seenPaths.set(path, null)
        includePaths.delete(path)
      }
      continue
    }
    seenPaths.set(path, ty)
    includePaths.add(path)
  }

  for (const path of includePaths) {
    const parts = path.split("::")
    const name = parts.at(-1)!
    const map = getOrInit(nameCounts, name, () => new Map())
    for (let i = 0; i < parts.length; i++) {
      const pathPart = parts.slice(0, i).join("::")
      map.set(pathPart, (map.get(pathPart) ?? 0) + 1)
    }
  }

  for (const path of includePaths) {
    const parts = path.split("::")
    const name = parts.at(-1)!
    const map = nameCounts.get(name)!
    const pathLength = parts.findIndex((_, i) => map.get(parts.slice(0, i).join("::")) === 1)
    const newPath = [...parts.slice(0, pathLength), name].join("::")
    const newName = normalizeTypeName(newPath)
    names.set(path, newName)
  }

  return [tys.map((_, i) => visit(i)), paths]

  function visit(i: number): Codec<any> {
    return getOrInit(memo, i, () => {
      memo.set(i, $.deferred(() => memo.get(i)!))
      const ty = tys[i]!
      const rawPath = ty.path.join("::")
      const usePath = includePaths.has(rawPath)
      const path = names.get(rawPath) ?? rawPath
      if (usePath && paths[path]) return paths[path]!
      const codec = withDocs(ty.docs, _visit(ty))
      if (usePath) return paths[path] ??= codec
      return codec
    })
  }

  function _visit(ty: Ty): Codec<any> {
    const overrideFn = overrides[ty.path.join("::")]
    if (overrideFn) return overrideFn(ty, visit)
    if (ty.type === "Struct") {
      if (ty.fields.length === 0) {
        return $null
      } else if (ty.fields[0]!.name === undefined) {
        if (ty.fields.length === 1) {
          // wrapper
          return visit(ty.fields[0]!.ty)
        } else {
          return $.tuple(...ty.fields.map((x) => visit(x.ty)))
        }
      } else {
        return $.object(
          ...ty.fields.map((x) => maybeOptionalField(normalizeIdent(x.name!), visit(x.ty))),
        )
      }
    } else if (ty.type === "Tuple") {
      if (ty.fields.length === 0) {
        return $null
      } else if (ty.fields.length === 1) {
        // wrapper
        return visit(ty.fields[0]!)
      } else {
        return $.tuple(...ty.fields.map((x) => visit(x)))
      }
    } else if (ty.type === "Union") {
      if (ty.members.length === 0) {
        return $.never as any
      } else if (ty.members.every((x) => x.fields.length === 0)) {
        const members: Record<number, string> = {}
        for (const { index, name } of ty.members) {
          members[index] = normalizeIdent(name)
        }
        return $.literalUnion(members)
      } else {
        const members: Record<number, $.Variant<any, any>> = {}
        for (const { fields, name, index } of ty.members) {
          let member: $.Variant<any, any>
          const type = normalizeIdent(name)
          if (fields.length === 0) {
            member = $.variant(type)
          } else if (fields[0]!.name === undefined) {
            // Tuple variant
            const $value = fields.length === 1
              ? visit(fields[0]!.ty)
              : $.tuple(...fields.map((f) => visit(f.ty)))
            member = $.variant(type, maybeOptionalField("value", $value))
          } else {
            // Object variant
            const memberFields = fields.map((field) => {
              return maybeOptionalField(normalizeIdent(field.name!), visit(field.ty))
            })
            member = $.variant(type, ...memberFields)
          }
          members[index] = member
        }
        return $.taggedUnion("type", members)
      }
    } else if (ty.type === "Sequence") {
      const $inner = visit(ty.typeParam)
      if ($inner === $.u8) {
        return $.uint8Array
      } else {
        return $.array($inner)
      }
    } else if (ty.type === "SizedArray") {
      const $inner = visit(ty.typeParam)
      if ($inner === $.u8) {
        return $.sizedUint8Array(ty.len)
      } else {
        return $.sizedArray($inner, ty.len)
      }
    } else if (ty.type === "Primitive") {
      if (ty.kind === "char") return $.str
      return $[ty.kind]
    } else if (ty.type === "Compact") {
      return $.compact(visit(ty.typeParam))
    } else if (ty.type === "BitSequence") {
      return $.bitSequence
    } else {
      throw new Error("unreachable")
    }
  }
}

function withDocs<T>(_docs: string[], codec: Codec<T>): Codec<T> {
  const docs = normalizeDocs(_docs)
  if (docs) return $.withMetadata($.docs(docs), codec)
  return codec
}

function eqTy(tys: Ty[], a: number, b: number) {
  const seen = new Set<string>()
  return eqTy(a, b)

  function eqTy(ai: number, bi: number): boolean {
    const key = `${ai}=${bi}`
    if (seen.has(key)) return true
    seen.add(key)
    const a = tys[ai]!
    const b = tys[bi]!
    if (a.id === b.id) return true
    if (a.type !== b.type) return false
    if (a.path.join("::") !== b.path.join("::")) return false
    if (normalizeDocs(a.docs) !== normalizeDocs(b.docs)) return false
    if (
      !eqArray(
        a.params,
        b.params,
        (a, b) =>
          a.name === b.name
          && (a.ty == null) === (b.ty == null)
          && (a.ty == null || eqTy(a.ty!, b.ty!)),
      )
    ) {
      return false
    }
    if (a.type === "BitSequence") {
      return true
    }
    if (a.type === "Primitive" && b.type === "Primitive") {
      return a.kind === b.kind
    }
    if (
      a.type === "Compact" && b.type === "Compact" || a.type === "Sequence" && b.type === "Sequence"
    ) {
      return eqTy(a.typeParam, b.typeParam)
    }
    if (a.type === "SizedArray" && b.type === "SizedArray") {
      return a.len === b.len && eqTy(a.typeParam, b.typeParam)
    }
    if (a.type === "Struct" && b.type === "Struct") {
      return eqArray(a.fields, b.fields, eqField)
    }
    if (a.type === "Tuple" && b.type === "Tuple") {
      return eqArray(a.fields, b.fields, eqTy)
    }
    if (a.type === "Union" && b.type === "Union") {
      return eqArray(
        a.members,
        b.members,
        (a, b) =>
          a.index === b.index
          && a.name === b.name
          && normalizeDocs(a.docs) === normalizeDocs(b.docs)
          && eqArray(a.fields, b.fields, eqField),
      )
    }
    return false
  }

  function eqField(a: $.Native<typeof $field>, b: $.Native<typeof $field>) {
    return a.name === b.name
      && a.typeName === b.typeName
      && eqDocs(a.docs, b.docs)
      && eqTy(a.ty, b.ty)
  }

  function eqDocs(a: string[], b: string[]) {
    return normalizeDocs(a) === normalizeDocs(b)
  }

  function eqArray<T>(a: T[], b: T[], eqVal: (a: T, b: T) => boolean) {
    return a.length === b.length && a.every((x, i) => eqVal(x, b[i]!))
  }
}

const optionInnerVisitor = new $.CodecVisitor<$.AnyCodec | null>()
  .add($.option, (_codec, $some) => $some)
  .fallback(() => null)
function maybeOptionalField(key: PropertyKey, $value: $.AnyCodec): $.AnyCodec {
  const $inner = optionInnerVisitor.visit($value)
  return $inner ? $.optionalField(key, $inner) : $.field(key, $value)
}
