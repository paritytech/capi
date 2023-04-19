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
      .add($.taggedUnion, (_, _tagKey: string, variantsRaw) => {
        const variants = Array.isArray(variantsRaw) ? variantsRaw : Object.values(variantsRaw)
        const callTypeName = this.typeCodegen.typeNames.get(call)!
        return variants.map((variant) =>
          `${variant.tag}: <X>(...args: Parameters<typeof ${callTypeName}.${variant.tag}<X>>) => C.ExtrinsicRune<${this.chainIdent}, C.RunicArgs.U<X>>`
        )
      })
      .add($.literalUnion<unknown>, (_, values) => {
        const variants = Object.values(values)
        return variants.map((value) => {
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

  palletJs(pallet: Pallet) {
    // const storageEntries = Object.values(pallet.storage)
    // const storageEntriesJs = storageEntries.length
    //   ? storageEntries
    //     .map((storageEntry) => this.storageDts(pallet, storageEntry))
    //     .join(",\n")
    //     .concat(",")
    //   : ""
    // const constants = Object.values(pallet.constants)
    // const constantsJs = constants.length
    //   ? constants
    //     .map((constant) => this.constantDts(constant))
    //     .join(",\n")
    //     .concat(",")
    //   : ""
    return `${pallet.name} = (() => {
      const pallet = this.pallet("${pallet.name}")
      return {}
    })()`
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
