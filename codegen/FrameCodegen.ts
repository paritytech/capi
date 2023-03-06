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
      "chain.ts",
      `
import * as _codecs from "./codecs.ts"
import { connection } from "./connection.ts"
import * as C from "./capi.ts"

export const metadata = ${this.codecCodegen.print(this.metadata)} satisfies C.FrameMetadata

export interface ${this.chainName} extends C.Chain {
  metadata: typeof metadata
}

export const chain = C.Rune.rec({ metadata, connection }).into(C.ChainRune<${this.chainName}, never>)
`,
    )

    files.set(
      "mod.ts",
      `
export * from "./connection.ts"
export * from "./chain.ts"
export * from "./pallets.ts"
import "./types/mod.ts"
`,
    )

    files.set(
      "pallets.ts",
      `
import { chain } from "./chain.ts"

${
        Object.values(this.metadata.pallets).map((pallet) => `
export namespace ${pallet.name} {
  export const pallet = chain.pallet(${JSON.stringify(pallet.name)})
  ${
          Object.values(pallet.storage).map((storage) => `
  export const ${storage.name} = pallet.storage(${JSON.stringify(storage.name)})
  `).join("\n\n")
        }
}
`).join("\n\n")
      }
`,
    )

    this.codecCodegen.write(files)
    this.typeCodegen.write(files)
  }
}
