import { hex } from "../crypto/mod.ts"
import * as $ from "../deps/scale.ts"
import { Constant, FrameMetadata, Pallet, StorageEntry } from "../frame_metadata/mod.ts"
import { CodecCodegen } from "./CodecCodegen.ts"
import { TypeCodegen } from "./TypeCodegen.ts"

export class FrameCodegen {
  codecCodegen
  typeCodegen
  constructor(readonly metadata: FrameMetadata, readonly chainIdent: string) {
    this.codecCodegen = new CodecCodegen()
    this.typeCodegen = new TypeCodegen(this.codecCodegen, metadata.types)

    this.codecCodegen.visit(metadata)
  }

  write(files: Map<string, string>) {
    files.set("mod.d.ts", this.mod)
    files.set("mod.js", this.mod)
    files.set("chain.d.ts", this.chainDts())
    files.set("chain.js", this.chainJs())
    this.codecCodegen.write(files)
    this.typeCodegen.write(files)
  }

  mod = `
    export * from "./connection.js"
    export * from "./chain.js"
    export * from "./types.js"
  `

  chainDts() {
    return `
      import * as _codecs from "./codecs.js"
      import * as C from "./capi.js"
      import * as t from "./types.js"

      export const metadata: metadata
      export type metadata = ${this.typeCodegen.print(this.metadata)}

      export interface ${this.chainIdent} extends C.Chain<metadata> {}

      export class ${this.chainIdent}Rune<U> extends C.ChainRune<${this.chainIdent}, U> {
        static override from(connect: (signal: AbortSignal) => C.Connection): ${this.chainIdent}Rune

        ${Object.values(this.metadata.pallets).map((pallet) => this.palletDts(pallet)).join("\n")}
      }

      export const chain: ${this.chainIdent}Rune<never>
    `
  }

  chainJs() {
    return `
      import * as _codecs from "./codecs.js"
      import { connect } from "./connection.js"
      import * as C from "./capi.js"
      import * as t from "./types.js"

      export const metadata = ${this.codecCodegen.print(this.metadata)}

      export class ${this.chainIdent}Rune extends C.ChainRune {
        static from(connect) {
          return super.from(connect, metadata)
        }

        ${Object.values(this.metadata.pallets).map((pallet) => this.palletJs(pallet)).join("\n")}
      }

      export const chain = ${this.chainIdent}.from(connect)
    `
  }

  palletDts(pallet: Pallet) {
    const storageDts = this.statementGroup(
      pallet,
      pallet.storage,
      (pallet, storageEntry) => this.storageDts(pallet, storageEntry),
    )
    const constantsDts = this.statementGroup(
      pallet,
      pallet.constants,
      (_pallet, constant) => this.constantDts(constant),
    )
    const extrinsicsDts = pallet.types.call ? this.extrinsicsDts(pallet, pallet.types.call) : ""
    return `${pallet.name}: {
      ${extrinsicsDts}
      ${storageDts}
      ${constantsDts}
    }`
  }

  extrinsicsDts(_pallet: Pallet, call: $.AnyCodec) {
    return new $.CodecVisitor<string[]>()
      .add($.taggedUnion, (_codec, _tagKey: string, variantsRaw) => {
        return (Array.isArray(variantsRaw) ? variantsRaw : Object.values(variantsRaw))
          .map((variant) =>
            this.extrinsicFactoryDts(this.typeCodegen.typeNames.get(call)!, variant.tag)
          )
      })
      .add($.literalUnion<unknown>, (_, values) => {
        return Object.values(values).map((value) => {
          if (typeof value !== "string") {
            throw new Error("pallet call non-string literalUnion is unsupported")
          }
          return `${value}: () => C.ExtrinsicRune<${this.chainIdent}, never>`
        })
      })
      .add($.never, () => [])
      .visit(call)
      .join("\n")
  }

  extrinsicsJs(pallet: Pallet, call: $.AnyCodec) {
    const palletCallFactory = this.typeCodegen.typeNames.get(call)!
    return new $.CodecVisitor<string[]>()
      .add($.taggedUnion, (_codec, _tagKey: string, variantsRaw) => {
        return (Array.isArray(variantsRaw) ? variantsRaw : Object.values(variantsRaw))
          .map((variant) => this.extrinsicFactoryJs(palletCallFactory, pallet.name, variant.tag))
      })
      .add($.literalUnion<unknown>, (_, values) => {
        return Object.values(values).map((value) => {
          if (typeof value !== "string") {
            throw new Error("pallet call non-string literalUnion is unsupported")
          }
          return this.extrinsicFactoryJs(palletCallFactory, pallet.name, value)
        })
      })
      .add($.never, () => [])
      .visit(call)
      .join("\n")
  }

  palletJs(pallet: Pallet) {
    const storageEntries = Object.values(pallet.storage)
    const storageEntriesJs = storageEntries.length
      ? storageEntries
        .map((storageEntry) => this.storageJs(storageEntry.name))
        .join("\n")
      : ""
    const constants = Object.values(pallet.constants)
    const constantsJs = constants.length
      ? constants
        .map((constant) => this.constantJs(constant))
        .join("\n")
      : ""
    const extrinsicsJs = pallet.types.call ? this.extrinsicsJs(pallet, pallet.types.call) : ""
    return `${pallet.name} = (() => {
      const chain = this
      const pallet = chain.pallet("${pallet.name}")
      return {
        ${storageEntriesJs}
        ${constantsJs}
        ${extrinsicsJs}
      }
    })()`
  }

  extrinsicFactoryDts(palletCallFactory: string, methodIdent: string) {
    return `${methodIdent}<X>(
      props: C.RunicArgs<X, Omit<${palletCallFactory}.${methodIdent}, "type">>
    ): C.ExtrinsicRune<${this.chainIdent}, C.RunicArgs.U<X>>`
  }

  extrinsicFactoryJs(palletCallFactory: string, palletIdent: string, methodIdent: string) {
    return `${methodIdent}(...args) {
      return chain.extrinsic(C.Rune.object({
        type: "${palletIdent}",
        value: ${palletCallFactory}(...args),
      }))
    },`
  }

  storageDts(pallet: Pallet, storage: StorageEntry) {
    return `${storage.name}: C.StorageRune<${this.chainIdent}, "${pallet.name}", "${storage.name}", never>`
  }

  storageJs(storageIdent: string) {
    return `${storageIdent}: pallet.storage("${storageIdent}"),`
  }

  constantDts(constant: Constant) {
    return `${constant.name}: ${this.typeCodegen.native(constant.codec)}`
  }

  constantJs(constant: Constant) {
    return `${constant.name}: ${this.codecCodegen.print(constant.codec)}.decode(C.hex.decode("${
      hex.encode(constant.value)
    }")),`
  }

  statementGroup<T extends StorageEntry | Constant>(
    pallet: Pallet,
    entries: Record<string, T>,
    toCode: (pallet: Pallet, value: T) => string,
  ) {
    const values = Object.values(entries)
    return values.length
      ? values.map((value) => toCode(pallet, value)).join("\n").concat(",")
      : ""
  }
}
