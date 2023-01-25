import { Metadata } from "../../frame_metadata/mod.ts"
import { Ty } from "../../scale_info/mod.ts"
import { Codegen } from "../Codegen.ts"
import { File } from "../File.ts"
import { codecs } from "./codecs.ts"
import { extrinsic, extrinsicInfo } from "./extrinsic.ts"
import { pallet } from "./pallet.ts"
import { type } from "./type.ts"
import { typeVisitor } from "./typeVisitor.ts"

export interface FrameCodegenProps {
  metadata: Metadata
  clientFile: File
  rawClientFile?: File
}

export class FrameCodegen extends Codegen {
  metadata
  clientFile

  typeVisitor
  typeFiles = new Map<string, TypeFile>()

  constructor({ metadata, clientFile, rawClientFile }: FrameCodegenProps) {
    super()
    this.metadata = metadata
    this.clientFile = clientFile

    this.typeVisitor = typeVisitor(this)

    for (const [path, typeFile] of this.typeFiles) {
      const filePath = path + typeFile.ext
      this.files[filePath] = type(this, path, filePath, typeFile)
    }

    this.files["codecs.ts"] = codecs(this)

    this.files["client/mod.ts"] = clientFile
    if (rawClientFile) this.files["client/raw.ts"] = rawClientFile

    const extrinsicInfo_ = extrinsicInfo(this)
    this.files["extrinsic.ts"] = extrinsic(this, extrinsicInfo_)

    const callTySrcPath = this.typeVisitor.visit(extrinsicInfo_.callTy)

    let palletNamespaceExports = ""
    for (const p of this.metadata.pallets) {
      if (!p.calls && !p.constants.length && !p.storage?.entries.length) continue
      this.files[`${p.name}.ts`] = pallet(this, p, callTySrcPath)
      palletNamespaceExports += `export * as ${p.name} from "./${p.name}.ts"\n`
    }

    this.files["mod.ts"] = new File(`
      export * from "./extrinsic.ts"
      export * from "./client/mod.ts"
      export * as t from "./types/mod.ts"

      ${palletNamespaceExports}
    `)
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
