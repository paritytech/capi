import * as M from "../frame_metadata/mod.ts"
import { Files } from "./Files.ts"

export type S = string | number | S[]

export namespace S {
  export function array(items: S[]): S {
    return ["[", items.map((x) => [x, ","]), "]"]
  }
  export function object(
    ...items: (readonly [doc: S, prop: S, val: S] | readonly [prop: S, val: S])[]
  ): S {
    return ["{", items.map((x) => [x.slice(0, -1), ":", x.at(-1)!, ","]), "}"]
  }
  export function string(value: string): S {
    return JSON.stringify(value)
  }
  export function toString(value: S): string {
    if (!(value instanceof Array)) return value.toString()
    const parts = value.map(S.toString)
    return parts.map((x) => x.trim()).join(parts.some((x) => x.includes("\n")) ? "\n" : " ").trim()
  }
}

export type Decl = { path: string; code: S }

export function getPath(tys: M.Ty[], ty: M.Ty): string | null {
  if (ty.type === "Struct" && ty.fields.length === 1 && ty.params.length) return null
  return _getPath(ty)

  function _getPath(ty: M.Ty): string | null {
    if (ty.type === "Primitive") {
      return ty.kind
    }
    if (ty.type === "Compact") {
      return null
    }
    if (ty.path.at(-1) === "Era") return "Era"
    if (["Option", "Result", "Cow", "BTreeMap", "BTreeSet"].includes(ty.path[0]!)) return null
    const baseName = ty.path.join(".")
    if (!baseName) return null
    return baseName + ty.params.map((p, i) => {
      if (p.ty === undefined) return ""
      if (tys.every((x) => x.path.join(".") !== baseName || x.params[i]!.ty === p.ty)) {
        return ""
      }
      return ".$$" + (_getPath(p.ty) ?? p.ty)
    }).join("")
  }
}

export function getName(path: string) {
  return path.split(".").at(-1)!
}

export function makeDocComment(docs: string[]) {
  docs = docs.map((x) => x.replace(/^\s*\n\s*|\s*\n\s*$/, "").replace(/\s*\n\s*/g, " "))
  if (!docs.length) return ""
  if (docs.length === 1) return `/** ${docs[0]!.trim()} */\n`
  return `/**\n  * ${docs.join("\n  * ")}\n  */`
}

export function getRawCodecPath(ty: M.Ty) {
  return `_codec.$${ty.id}`
}

export function getCodecPath(tys: M.Ty[], ty: M.Ty) {
  if (ty.type === "Primitive") {
    return ty.kind === "char" ? "$.str" : "$." + ty.kind
  }
  const path = getPath(tys, ty)
  if (path === null) return getRawCodecPath(ty)
  const parts = path.split(".")
  return [
    ...parts.slice(0, -1),
    "$" + parts.at(-1)![0]!.toLowerCase() + parts.at(-1)!.slice(1),
  ].join(".")
}

export function printDecls(
  decls: Decl[],
  imports: (depth: number, content: string) => S[],
  path: string[],
  files: Files,
) {
  const namespaces: Record<string, Decl[]> = {}
  const done: Decl[] = []
  for (const { path, code } of decls) {
    if (path.includes(".")) {
      const [ns, ...rest] = path.split(".")
      ;(namespaces[ns!] ??= []).push({ path: rest.join("."), code })
    } else {
      done.push({ path, code })
    }
  }
  const reexports: S[] = []
  for (const ns in namespaces) {
    const file = printDecls(namespaces[ns]!, imports, [...path, ns], files)
    reexports.push([
      "export * as",
      ns,
      "from",
      S.string("./" + file),
    ])
  }
  // sort by path, _s first
  done.sort((a, b) =>
    a.path.startsWith("_") !== b.path.startsWith("_")
      ? a.path.startsWith("_") ? -1 : 1
      : a.path < b.path
      ? -1
      : a.path > b.path
      ? 1
      : 0
  )
  const file = path.length
    ? (path.at(-1) + (Object.keys(namespaces).length ? "/mod.ts" : ".ts"))
    : "mod.ts"
  // Deduplicate -- metadata has redundant entries (e.g. pallet_collective::RawOrigin)
  const content = [...new Set(done.map((x) => S.toString(x.code)))].join("\n\n")
  const code = [
    ...imports(path.length - +!Object.keys(namespaces).length, content),
    "\n\n",
    ...reexports,
    "\n\n",
    content,
  ]
  files.set([...path.slice(0, -1), file].join("/"), { getContent: () => code })
  return file
}
