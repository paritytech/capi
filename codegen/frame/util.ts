import { Ty } from "../../scale_info/mod.ts"

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

export function makeDocComment(docs: string[] = []) {
  docs = docs.map((x) => x.replace(/^\s*\n\s*|\s*\n\s*$/, "").replace(/\s*\n\s*/g, " "))
  if (!docs.length) return ""
  if (docs.length === 1) return `/** ${docs[0]!.trim()} */\n`
  return `/**\n  * ${docs.join("\n  * ")}\n  */\n`
}

export function getRawCodecPath(ty: Ty) {
  return `codecs.$${ty.id}`
}
