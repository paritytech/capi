import {
  blake2_128,
  blake2_128Concat,
  blake2_256,
  hex,
  identity,
  twox128,
  twox256,
  twox64Concat,
} from "../crypto/mod.ts"
import * as $ from "../deps/scale.ts"
import { ChainError } from "../scale_info/mod.ts"
import { stringifyKey } from "../util/mod.ts"
import { getOrInit } from "../util/state.ts"

export class CodecCodegen {
  codecIds = new Map<$.Codec<any>, null | number>()
  nextCodecId = 0

  serialized = new Map<unknown, string>([
    [blake2_128, "C.blake2_128"],
    [blake2_128Concat, "C.blake2_128Concat"],
    [blake2_256, "C.blake2_256"],
    [identity, "C.identity"],
    [twox128, "C.twox128"],
    [twox256, "C.twox256"],
    [twox64Concat, "C.twox64Concat"],
    [ChainError, "C.ChainError"],
    [ChainError.toArgs, "C.ChainError.toArgs"],
  ])

  visitingCircular = new Map<$.Codec<any>, boolean>()
  visit(value: unknown) {
    if (
      typeof value !== "object" && typeof value !== "function" || !value
      || value instanceof Uint8Array
    ) return
    if (value instanceof $.Codec) {
      const existing = this.codecIds.get(value)
      if (existing === null) {
        this.codecIds.set(value, this.nextCodecId++)
      } else if (existing === undefined) {
        const meta = value._metadata[0]
        if (!meta || meta.type === "atomic") return
        if (meta.factory === $.deferred) {
          this.codecIds.set(value, this.nextCodecId++)
          const inner = meta.args[0]()
          if (this.visitingCircular.has(inner)) this.visitingCircular.set(inner, true)
          else this.visit(inner)
        } else {
          this.visitingCircular.set(value, false)
          this.visit(meta.args)
          this.visitingCircular.delete(value)
          this.codecIds.set(value, null)
        }
      }
      return
    }
    if (value instanceof Array) {
      for (const item of value) {
        this.visit(item)
      }
      return
    }
    this.visit(Object.values(value))
  }

  print(value: unknown, forcePrint = false): string {
    return getOrInit(
      forcePrint ? { get: () => undefined, set: () => {} } : this.serialized,
      value,
      () => {
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
          const meta = value._metadata[0]
          if (!meta) throw new Error("Cannot serialize metadata-less codec")
          if (meta.type === "atomic") return `C.${meta.name}`
          const id = this.codecIds.get(value)
          if (id == null || forcePrint) {
            if (meta.factory === $.deferred) {
              return `C.$.deferred(() => ${this.print(meta.args[0]())})`
            }
            return `C.${meta.name}(${meta.args.map((x) => this.print(x)).join(", ")})`
          }
          return `_codecs.$${id}`
        }
        if (value instanceof $.Variant) {
          return `C.$.variant(${this.print(value.tag)}, ${
            this.print(value.codec._metadata[0]!.args!).slice(1, -1)
          })`
        }
        if (value instanceof Array) {
          return `[${value.map((x) => this.print(x)).join(", ")}]`
        }
        if (value instanceof Uint8Array) {
          return `C.hex.decode(${JSON.stringify(hex.encode(value))})`
        }
        const prototype = Object.getPrototypeOf(value)
        if (prototype !== Object.prototype && prototype !== null) {
          throw new Error("Cannot serialize " + value)
        }
        return `{ ${
          [
            ...prototype === null ? ["__proto__: null"] : [],
            ...Object.entries(value!).map(([key, value]) =>
              `${stringifyKey(key)}: ${this.print(value)}`
            ),
          ].join(", ")
        } }`
      },
    )
  }

  write(files: Map<string, string>) {
    const codecDefinitionStatements = [...this.codecIds.entries()]
      .filter((x) => x[1] != null)
      .map(([codec, id]) => {
        const printed = this.print(codec, true).replace(/\b_codecs\.\$(\d+)\b/g, (_, i) => `$${i}`)
        return `export const $${id} = ${printed}`
      })
      .join("\n\n")
    files.set(
      "codecs.js",
      `
        import * as C from "./capi.js"

        ${codecDefinitionStatements}
      `,
    )
  }
}
