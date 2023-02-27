import { encode as hexEncode } from "../crypto/hex.ts"
import * as $ from "../deps/scale.ts"
import { Blake2b } from "../deps/wat_the_crypto.ts"
import { getOrInit, WeakRefMap } from "../util/mod.ts"

export class Id {
  private constructor(public hex: string, public u8a: Uint8Array) {}

  private static u8aMap = new WeakRefMap<string, Id>()
  private static fromU8a(u8a: Uint8Array) {
    const hex = hexEncode(u8a)
    return getOrInit(this.u8aMap, hex, () => new Id(hex, u8a))
  }

  static random() {
    return this.fromU8a(crypto.getRandomValues(new Uint8Array(64)))
  }

  private static locMap = new Map<TemplateStringsArray, Id>()
  static loc(tag: TemplateStringsArray) {
    return getOrInit(this.locMap, tag, () => this.random())
  }

  private static _hash(u8a: Uint8Array) {
    const hasher = new Blake2b()
    hasher.update(u8a)
    return this.fromU8a(hasher.digest())
  }

  private static valueMap = new WeakRefMap<unknown, Id>()
  static value(value: unknown): Id {
    if (value instanceof Id) {
      return value
    } else if (
      typeof value === "object"
      && value
      && "id" in value
      && value["id" as never] as any instanceof Id
    ) {
      return value["id" as never]
    }
    return getOrInit(this.valueMap, value, () => {
      if (typeof value === "number") {
        return this._hash(new Uint8Array(new Float64Array([value])))
      }
      if (typeof value === "string") {
        return this._hash(new TextEncoder().encode(value))
      }
      if (typeof value === "bigint") {
        return this._hash($.i256.encode(value))
      }
      if (typeof value === "boolean") {
        return this._hash(new Uint8Array([+value]))
      }
      return this.random()
    })
  }

  static hash(base: Id, ...rest: unknown[]) {
    const hasher = new Blake2b()
    hasher.update(base.u8a)
    for (const value of rest) {
      hasher.update(this.value(value).u8a)
    }
    return this.fromU8a(hasher.digest())
  }

  toString() {
    return this.hex
  }
}
