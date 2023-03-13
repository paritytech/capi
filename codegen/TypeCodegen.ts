import { $hash } from "../crypto/mod.ts"
import * as $ from "../deps/scale.ts"
import {
  $emptyKey,
  $partialEmptyKey,
  $partialMultiKey,
  $partialSingleKey,
  $storageKey,
} from "../frame_metadata/key_codecs.ts"
import { $era, $null, ChainError } from "../scale_info/mod.ts"
import { getOrInit, stringifyKey, stringifyPropertyAccess } from "../util/mod.ts"
import { CodecCodegen } from "./CodecCodegen.ts"

export class TypeCodegen {
  constructor(readonly codecCodegen: CodecCodegen, readonly types: Record<string, $.Codec<any>>) {
    this.codecCodegen.visit(types)
    for (const path in types) {
      this.typeNames.set(types[path]!, `t.${path}`)
    }
  }

  extractObjectFields = new $.CodecVisitor<[keyof any, $.Codec<any>][]>().generic((visitor) =>
    visitor
      .add($.object, (_codec, ...entries) => entries.flatMap((x) => visitor.visit(x)))
      .add($.field, (_codec, key, value) => [[key, value]])
      .add($.optionalField, (_codec, key, value) => [[key, $.option(value)]])
  )

  isTuple = new $.CodecVisitor<boolean>().add($.tuple, () => true).fallback(() => false)

  typeVisitor = new $.CodecVisitor<string>()
    .add($.int, (_codec, _signed, size) => size > 32 ? "bigint" : "number")
    .add($.str, () => "string")
    .add($.bool, () => "boolean")
    .add($.tuple<$.Codec<any>[]>, (_codec, ...entries) => `[${entries.map((x) => this.print(x))}]`)
    .add($.array, (_codec, inner) => `Array<${this.print(inner)}>`)
    .add(
      $.sizedArray,
      (_codec, inner, size) => `[${Array(size).fill(this.print(inner)).join(", ")}]`,
    )
    .add($.uint8Array, () => "Uint8Array")
    .add($.sizedUint8Array, () => "Uint8Array")
    .add($.option, (_codec, inner) => this.print(inner) + " | undefined")
    .add($.result, (_codec, ok, err) => this.print(ok) + " | " + this.print(err))
    .add($.instance, (_codec, ctor, inner) => {
      if (ctor !== ChainError) throw new Error("Cannot get type for non-ChainError $.instance")
      return `C.ChainError<${this.print(inner).slice(1, -1)}>`
    })
    .add($.lenPrefixed, (_codec, inner) => this.print(inner))
    .add($.compact, (_codec, inner) => this.print(inner))
    .add($hash, (_codec, _hasher, inner) => this.print(inner))
    .add($.deferred, (_codec, inner) => this.print(inner()))
    .add($.set, (_codec, inner) => `Set<${this.print(inner)}>`)
    .add($.map, (_codec, key, val) => `Map<${this.print(key)}, ${this.print(val)}>`)
    .add($.bitSequence, () => "C.$.BitSequence")
    .add($era, () => "C.Era")
    .add($storageKey, (_codec, _palletName, _entryName, inner) => this.print(inner))
    .add($emptyKey, () => "void")
    .add($partialEmptyKey, () => "void | null")
    .add($partialSingleKey, (_codec, inner) => this.print(inner) + " | null")
    .add(
      $partialMultiKey<any>,
      (_codec, ...entries) => `C.PartialMultiKey<${this.print($.tuple(...entries))}>`,
    )
    .add(
      $.field<string, any>,
      (_codec, key, value) => `{ ${stringifyKey(key)}: ${this.print(value)} }`,
    )
    .add(
      $.optionalField<string, any>,
      (_codec, key, value) => `{ ${stringifyKey(key)}?: ${this.print(value)} }`,
    )
    .add(
      $.object,
      (_codec, ...entries) =>
        entries.map((x) => this.print(x)).join(" & ").replace(/} & {/g, ", ") || "{}",
    )
    .add(
      $.taggedUnion<string, $.Variant<any, any>[]>,
      (_codec, tagKey, variants) =>
        `(${
          Object.values(variants).map((v) =>
            `{ ${stringifyKey(tagKey)}: ${JSON.stringify(v.tag)} } & ${this.print(v.codec)}`
              .replace(
                /} & {/g,
                ", ",
              )
          ).join(" | ")
        })`,
    )
    .add(
      $.literalUnion,
      (_codec, variants) =>
        Object.values(variants).map((v) => this.codecCodegen.print(v)).join(" | "),
    )
    .add($.never, () => "never")
    .add($null, () => "null")

  declVisitor = new $.CodecVisitor<(name: string) => string>()
    .add($.taggedUnion, (_codec, tagKey: string, variants) => (name) => `
export type ${name} = ${
      Object.values(variants).map((variant) => `${name}.${variant.tag}`).join(" | ")
    }

export namespace ${name} {
  ${
      Object.values(variants).map((variant) => {
        const fields = this.extractObjectFields.visit(variant.codec)
        let params
        let populate
        if (fields.length === 1 && fields[0]![0] === "value") {
          const inner = fields[0]![1]
          if (this.isTuple.visit(inner)) {
            params = `...value: C.RunicArgs<X, ${name}.${variant.tag}["value"]>`
            populate = "value: C.Rune.tuple(value)"
          } else {
            params = `...[value]: C.RunicArgs<X, [value: ${name}.${variant.tag}["value"]]>`
            populate = "value"
          }
        } else if (fields.length === 0) {
          params = ""
          populate = ""
        } else {
          params = `value: C.RunicArgs<X, Omit<${name}.${variant.tag}, ${JSON.stringify(tagKey)}>>`
          populate = "...C.RunicArgs.resolve(value)"
        }
        return `
export type ${variant.tag} = ${this.typeVisitor.visit($.taggedUnion(tagKey, [variant]))}
export function ${variant.tag}<X>(${params}): C.ValueRune<${name}.${variant.tag}, C.RunicArgs.U<X>> {
  return C.Rune.rec({ ${stringifyKey(tagKey)}: ${JSON.stringify(variant.tag)}, ${populate} })
}
export function is${variant.tag}(value: ${name}): value is ${name}.${variant.tag} {
  return value${stringifyPropertyAccess(tagKey)} === ${JSON.stringify(variant.tag)}
}
        `
      }).join("\n")
    }
}
`)
    .fallback((codec) => (name) => `export type ${name} = ${this.typeVisitor.visit(codec)}`)

  typeNames = new Map<$.Codec<any>, string>()

  print(codec: $.Codec<any>): string {
    return this.typeNames.get(codec) ?? this.typeVisitor.visit(codec)
  }

  _write(files: Map<string, string>, path: string[], entries: [string[], $.Codec<any>][]): boolean {
    const groups = new Map<string, [string[], $.Codec<any>][]>()
    const codecs = []
    for (const entry of entries) {
      const name = entry[0][path.length]!
      if (entry[0].length === path.length + 1) {
        codecs.push([name, entry[1]] as const)
      } else {
        getOrInit(groups, name, () => []).push(entry)
      }
    }
    const isFolder = !!groups.size
    const rootDir = "../".repeat(path.length + +isFolder)
    files.set(
      `${["types", ...path].join("/")}${isFolder ? "/mod" : ""}.ts`,
      `
import * as C from "${rootDir}capi.ts"
import * as _codecs from "${rootDir}codecs.ts"
import * as t from "${rootDir}types/mod.ts"

${
        [...groups].map(([name, entries]) => {
          const isFolder = this._write(files, [...path, name], entries)
          return `export * as ${name} from ${
            JSON.stringify(`./${name}${isFolder ? "/mod.ts" : ".ts"}`)
          }`
        }).join("\n")
      }

${
        codecs.map(([name, codec]) => `
export const $${name.replace(/^./, (x) => x.toLowerCase())}: C.$.Codec<${name}> = ${
          this.codecCodegen.print(codec)
        }
${this.declVisitor.visit(codec)(name)}
`).join("\n")
      }
    
`,
    )
    return isFolder
  }

  write(files: Map<string, string>) {
    this._write(files, [], Object.entries(this.types).map((x) => [x[0].split("."), x[1]]))
    files.set(
      "_codecs.d.ts",
      `
import * as C from "./capi.ts"
import * as t from "./types/mod.ts"

${
        [...this.codecCodegen.codecIds.entries()].filter((x) => x[1] != null).map(([codec, id]) => `
export const $${id}: C.$.Codec<${this.print(codec)}>
`).join("")
      }`,
    )
    files.set(
      "codecs.ts",
      `
// @deno-types="./_codecs.d.ts"
export * from "./_codecs.js"
`,
    )
  }
}
