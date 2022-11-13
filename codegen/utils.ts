import * as M from "../frame_metadata/mod.ts"
import { Files } from "./Files.ts"

export namespace S {
  export function array(items: string[]): string {
    return `[${items}]`
  }
  export function object(
    ...items:
      (readonly [doc: string, prop: string, val: string] | readonly [prop: string, val: string])[]
  ): string {
    return `{${items.map((x) => [...x.slice(0, -1), ":", x.at(-1)!].join(""))}}`
  }
  export function string(value: string): string {
    return JSON.stringify(value)
  }
}

export type Decl = { path: string; code: string }

export function getPath(tys: M.Ty[], ty: M.Ty): string | null {
  if (ty.type === "Struct" && ty.fields.length === 1 && ty.params.length) return null
  const path = _getPath(ty)
  if (path) return "types." + path
  return null

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
  return `/**\n  * ${docs.join("\n  * ")}\n  */\n`
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
  imports: (depth: number, content: string) => string[],
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
  const reexports: string[] = []
  for (const ns in namespaces) {
    const file = printDecls(namespaces[ns]!, imports, [...path, ns], files)
    reexports.push(`export * as ${ns} from ${S.string("./" + file)}`)
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
  const content = [...new Set(done.map((x) => x.code))].join("\n\n")
  const code = [
    ...imports(path.length - +!Object.keys(namespaces).length, content),
    "",
    ...reexports,
    "",
    content,
  ].join("\n")
  files.set([...path.slice(0, -1), file].join("/"), code)
  return file
}
