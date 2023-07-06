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
import { stringifyKey, stringifyPropertyAccess } from "../util/mod.ts"
import { CodecCodegen } from "./CodecCodegen.ts"

export class TypeCodegen {
  constructor(readonly codecCodegen: CodecCodegen, readonly types: Record<string, $.AnyCodec>) {
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
  isField = new $.CodecVisitor<boolean>()
    .add($.field<any, any, any>, () => true).fallback(() => false)

  nativeVisitor = new $.CodecVisitor<string>()
    .add($.int, (_codec, _signed, size) => size > 32 ? "bigint" : "number")
    .add($.str, () => "string")
    .add($.bool, () => "boolean")
    .add($.tuple<$.Codec<any>[]>, (_codec, ...entries) => `[${entries.map((x) => this.native(x))}]`)
    .add($.array, (_codec, inner) => `Array<${this.native(inner)}>`)
    .add(
      $.sizedArray,
      (_codec, inner, size) => `[${Array(size).fill(this.native(inner)).join(", ")}]`,
    )
    .add($.uint8Array, () => "Uint8Array")
    .add($.sizedUint8Array, () => "Uint8Array")
    .add($.option, (_codec, inner) => this.native(inner) + " | undefined")
    .add($.result, (_codec, ok, err) => this.native(ok) + " | " + this.native(err))
    .add($.instance, (_codec, ctor, inner) => {
      if (ctor !== ChainError) throw new Error("Cannot get type for non-ChainError $.instance")
      return `C.ChainError<${this.native(inner).slice(1, -1)}>`
    })
    .add($.lenPrefixed, (_codec, inner) => this.native(inner))
    .add($.compact, (_codec, inner) => this.native(inner))
    .add($hash, (_codec, _hasher, inner) => this.native(inner))
    .add($.deferred, (_codec, inner) => this.native(inner()))
    .add($.set, (_codec, inner) => `Set<${this.native(inner)}>`)
    .add($.map, (_codec, key, val) => `Map<${this.native(key)}, ${this.native(val)}>`)
    .add($.bitSequence, () => "C.$.BitSequence")
    .add($era, () => "C.Era")
    .add($storageKey, (_codec, _palletName, _entryName, inner) => this.native(inner))
    .add($emptyKey, () => "void")
    .add($partialEmptyKey, () => "void | null")
    .add($partialSingleKey, (_codec, inner) => this.native(inner) + " | null")
    .add(
      $partialMultiKey<any>,
      (_codec, ...entries) => `C.PartialMultiKey<${this.native($.tuple(...entries))}>`,
    )
    .add(
      $.field<string, any, any>,
      (_codec, key, value) => `{ ${stringifyKey(key)}: ${this.native(value)} }`,
    )
    .add(
      $.optionalField<string, any, any>,
      (_codec, key, value) => `{ ${stringifyKey(key)}?: ${this.native(value)} }`,
    )
    .add(
      $.object,
      (_codec, ...entries) =>
        entries.map((x) => this.native(x)).join(" & ").replace(/} & {/g, ", ") || "{}",
    )
    .add(
      $.taggedUnion<string, $.AnyVariant[]>,
      (_codec, tagKey, variants) =>
        `(${
          Object.values(variants).map((v) =>
            `{ ${stringifyKey(tagKey)}: ${JSON.stringify(v.tag)} } & ${this.native(v.codec)}`
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
    .add(
      $.documented,
      (_codec, docs, inner) => {
        if (this.isField.visit(inner)) {
          return `{\n${formatDocComment(docs)}\n${this.native(inner).slice(1)}`
        }
        return `${formatDocComment(docs)}\n` + this.native(inner)
      },
    )
    .add($.never, () => "never")
    .add($null, () => "null")

  declVisitor = new $.CodecVisitor<(name: string, isTypes: boolean) => string>()
    .generic((visitor) =>
      visitor.add(
        $.documented,
        (_codec, docs, inner) => (name, isTypes) =>
          (isTypes
            ? formatDocComment(docs) + "\n"
            : "") + visitor.visit(inner)(name, isTypes).trim(),
      )
    )
    .add($.literalUnion, (_codec, _variants) => (name, isTypes) => {
      const variants = Object.values(_variants) as string[]
      return isTypes
        ? `
            export type ${name} = ${this.nativeVisitor.visit(_codec)}
            export namespace ${name} {
              ${
          variants
            .map((variant) => `export const ${variant}: "${variant}"`)
            .join("\n")
        }
            }
          `
        : `
            export const ${name} = {
              ${
          variants
            .map((variant) => `${variant}: "${variant}",`)
            .join("\n")
        }
            }
          `
    })
    .add($.taggedUnion, (_codec, tagKey: string, variants) => (name, isTypes) => `
${
      isTypes
        ? `export type ${name} = ${
          Object.values(variants).map((variant) => `${name}.${variant.tag}`).join(" | ")
        }`
        : ""
    }

export ${isTypes ? `namespace ${name}` : `const ${name} =`} {
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
        if (isTypes) {
          const typeSrc = this.nativeVisitor.visit($.taggedUnion(tagKey, [variant]))
          return `
            export type ${variant.tag} = ${typeSrc}
            export function ${variant.tag}<X>(${params}): C.ValueRune<${name}.${variant.tag}, C.RunicArgs.U<X>>
            export function is${variant.tag}(value: ${name}): value is ${name}.${variant.tag}
          `
        } else {
          return `
            ${variant.tag}(${params.split(":")[0]}) {
              return C.Rune.object({
                ${tagKey}: "${variant.tag}",
                ${populate}
              })
            },
            is${variant.tag}(value) {
              return value${stringifyPropertyAccess(tagKey)} === "${variant.tag}"
            },
          `
        }
      }).join("\n")
    }
}
`)
    .add($.object, (_codec) => (name, isTypes) =>
      isTypes
        ? `
            export type ${name} = ${this.nativeVisitor.visit(_codec)}
            export function ${name}<X>(fields: C.RunicArgs<X, ${name}>): C.ValueRune<${name}, C.RunicArgs.U<X>>
          `
        : `
            export function ${name}(fields) {
              return C.Rune.object(fields)
            }
          `)
    .add($.tuple, (_codec, ..._element) => (name, isTypes) =>
      isTypes
        ? `
            export type ${name} = ${this.nativeVisitor.visit(_codec)}
            export function ${name}<X>(...elements: C.RunicArgs<X, ${name}>): C.ValueRune<${name}, C.RunicArgs.U<X>>
          `
        : `
            export function ${name}(...elements) {
              return C.Rune.tuple(elements)
            }
          `)
    .fallback((codec) => (name, isTypes) =>
      isTypes ? `export type ${name} = ${this.nativeVisitor.visit(codec)}` : ""
    )

  typeNames = new Map<$.AnyCodec, string>()

  native(codec: $.AnyCodec): string {
    return this.typeNames.get(codec) ?? this.nativeVisitor.visit(codec)
  }

  print(value: unknown): string {
    switch (typeof value) {
      case "string":
      case "number":
      case "boolean":
        return JSON.stringify(value)
      case "bigint":
        return value + "n"
      case "undefined":
        return "undefined"
      case "symbol":
        throw new Error("Cannot serialize symbol")
    }
    if (value === null) return "null"
    if (value instanceof $.Codec) {
      return `C.$.Codec<${this.native(value)}>`
    }
    if (value instanceof Array) {
      return `[${value.map((x) => this.print(x)).join(", ")}]`
    }
    if (value instanceof Uint8Array) {
      return "Uint8Array"
    }
    return `{ ${
      Object.entries(value!).map(([key, value]) => `${stringifyKey(key)}: ${this.print(value)}`)
        .join(", ")
    } }`
  }

  write(files: Map<string, string>) {
    for (const isTypes of [false, true]) {
      const ext = isTypes ? "d.ts" : "js"
      const statements = Object.entries(this.types).map(([name, codec]) => {
        const trailing = isTypes ? `: C.$.Codec<${name}>` : `= ${this.codecCodegen.print(codec)}`
        return `
          export const $${name.replace(/^./, (x) => x.toLowerCase())}${trailing}

          ${this.declVisitor.visit(codec)(name, isTypes).trim()}
        `
      }).join("\n")
      files.set(
        `types.${ext}`,
        `
          import * as C from "./capi.js"
          import * as _codecs from "./codecs.js"
          import * as t from "./types.js"

          ${statements}
        `,
      )
    }
    const codecDeclarations = [...this.codecCodegen.codecIds.entries()].filter((x) => x[1] != null)
      .map(([codec, id]) => `export const $${id}: ${this.print(codec)}`)
    files.set(
      "codecs.d.ts",
      `
        import * as C from "./capi.js"
        import * as t from "./types.js"

        ${codecDeclarations.join("\n")}
      `,
    )
  }
}

function formatDocComment(docs: string) {
  if (!docs) return ""
  if (!docs.includes("\n")) return `/** ${docs} */`
  return `/**\n${docs.replace(/^/gm, " * ")}\n*/`
}
