import { Metadata } from "../../frame_metadata/mod.ts"
import { Ty } from "../../scale_info/mod.ts"
import { Codegen } from "../Codegen.ts"
import { File } from "../File.ts"
import { codecs } from "./codecs.ts"
import { pallet } from "./pallet.ts"
import { type } from "./type.ts"
import { typeVisitor } from "./typeVisitor.ts"

export interface FrameCodegenProps {
  metadata: Metadata
  clientFile: File
}

export class FrameCodegen extends Codegen {
  metadata
  clientFile

  typeVisitor
  typeFiles = new Map<string, TypeFile>()

  constructor({ metadata, clientFile }: FrameCodegenProps) {
    super()
    this.metadata = metadata
    this.clientFile = clientFile

    this.typeVisitor = typeVisitor(this)

    for (const [path, typeFile] of this.typeFiles) {
      const filePath = path + typeFile.ext
      this.files.set(filePath, type(this, path, filePath, typeFile))
    }

    this.files.set("codecs.ts", codecs(this))

    this.files.set("client/mod.ts", clientFile)

    const callTy = Object
      .fromEntries(this.metadata.extrinsic.ty.params.map((x) => [x.name.toLowerCase(), x.ty]))
      .call!

    const callTySrcPath = this.typeVisitor.visit(callTy)

    let palletNamespaceExports = ""
    for (const p of this.metadata.pallets) {
      if (!p.calls && !p.constants.length && !p.storage?.entries.length) continue
      this.files.set(`${p.name}.ts`, pallet(this, p, callTySrcPath))
      palletNamespaceExports += `export * as ${p.name} from "./${p.name}.ts"\n`
    }

    this.files.set(
      "mod.ts",
      new File(`
      export * from "./client/mod.ts"
      export * as types from "./types/mod.ts"

      ${palletNamespaceExports}
    `),
    )
  }

  [Symbol.iterator]() {
    return Object.entries(this.files)[Symbol.iterator]()
  }
}

export class TypeFile {
  reexports = new Set<string>()
  types = new Map<string, Ty>()
  get ext() {
    return this.reexports.size ? "/mod.ts" : ".ts"
  }
}
