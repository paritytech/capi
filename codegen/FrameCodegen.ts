import { hex } from "../crypto/mod.ts"
import * as $ from "../deps/scale.ts"
import { FrameMetadata } from "../frame_metadata/mod.ts"
import { CodecCodegen } from "./CodecCodegen.ts"
import { TypeCodegen } from "./TypeCodegen.ts"

export interface FrameCodegenProps {
  metadata: FrameMetadata
  chainName: string
}

export class FrameCodegen {
  codecCodegen
  typeCodegen
  constructor(readonly metadata: FrameMetadata, readonly chainName: string) {
    this.codecCodegen = new CodecCodegen()
    this.typeCodegen = new TypeCodegen(this.codecCodegen, metadata.types)

    this.codecCodegen.visit(metadata)
  }

  write(files: Map<string, string>) {
    files.set(
      "chain.js",
      `
import * as _codecs from "./codecs.js"
import { connect } from "./connection.js"
import * as C from "./capi.js"
import * as t from "./types.js"

export const metadata = ${this.codecCodegen.print(this.metadata)}

export const chain = C.ChainRune.from(connect, metadata)
`,
    )
    files.set(
      "chain.d.ts",
      `
import * as _codecs from "./codecs.js"
import * as C from "./capi.js"
import * as t from "./types.js"

export const metadata: ${this.typeCodegen.print(this.metadata)}

export interface ${this.chainName} extends C.Chain {
  metadata: typeof metadata
}

export const chain: C.ChainRune<${this.chainName}, never>
`,
    )

    for (const isTypes of [false, true]) {
      const ext = isTypes ? "d.ts" : "js"
      files.set(
        `mod.${ext}`,
        `
export * from "./connection.js"
export * from "./chain.js"
export * from "./pallets.js"
export * from "./types.js"
`,
      )

      files.set(
        `pallets.${ext}`,
        `
import { chain, ${isTypes ? this.chainName : ""} } from "./chain.js"
import * as C from "./capi.js"
import * as _codecs from "./codecs.js"
import * as t from "./types.js"

${
          Object.values(this.metadata.pallets).map((pallet) => {
            const palletStr = JSON.stringify(pallet.name)
            return `
${isTypes ? "" : `var pallet = chain.pallet(${palletStr})`}
export ${isTypes ? `namespace ${pallet.name}` : `const ${pallet.name} =`} {
  ${
              isTypes
                ? `export const pallet: C.PalletRune<${this.chainName}, ${palletStr}, never>`
                : `pallet,`
            }
  ${
              Object.values(pallet.storage).map((storage) =>
                isTypes
                  ? `export const ${storage.name}: C.StorageRune<${this.chainName}, ${palletStr}, ${
                    JSON.stringify(storage.name)
                  }, never>`
                  : `${storage.name}: pallet.storage(${JSON.stringify(storage.name)}),`
              ).join("\n\n")
            }

  ${
              Object.values(pallet.constants).map((constant) =>
                isTypes
                  ? `export const ${constant.name}: ${this.typeCodegen.native(constant.codec)}`
                  : `${constant.name}: ${
                    this.codecCodegen.print(constant.codec)
                  }.decode(C.hex.decode(${JSON.stringify(hex.encode(constant.value))})),`
              ).join("\n\n")
            }

  ${
              new $.CodecVisitor<string[]>()
                .add($.taggedUnion, (_, _tagKey: string, variants) =>
                  Object.values(variants).map((variant) => {
                    const factoryName = `${
                      this.typeCodegen.typeNames.get(pallet.types.call!)
                    }.${variant.tag}`
                    return isTypes
                      ? `
export function ${variant.tag}<X>(...args: Parameters<typeof ${factoryName}<X>>): C.ExtrinsicRune<${this.chainName}, C.RunicArgs.U<X>>
`
                      : `
${variant.tag}(...args){
  return chain.extrinsic(C.Rune.rec({ type: ${palletStr}, value: ${factoryName}(...args) }))
},
`
                  }))
                .add($.literalUnion<unknown>, (_, values) =>
                  Object.values(values).map((value) => {
                    if (typeof value !== "string") {
                      throw new Error("pallet call non-string literalUnion is unsupported")
                    }
                    return isTypes
                      ? `
export function ${value}(): C.ExtrinsicRune<${this.chainName}, never>
`
                      : `
${value}(){
  return chain.extrinsic({ type: ${palletStr}, value: ${JSON.stringify(value)} })
},
`
                  }))
                .add($.never, () => [])
                .visit(pallet.types.call ?? $.never)
                .join("\n\n")
            }
}
`
          }).join("\n\n")
        }
`,
      )
    }

    this.codecCodegen.write(files)
    this.typeCodegen.write(files)
  }
}
