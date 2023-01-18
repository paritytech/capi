import { tsFormatter } from "../deps/dprint.ts"
import { Metadata } from "../frame_metadata/mod.ts"
import { Ty } from "../scale_info/mod.ts"
import { codecs } from "./codecs.ts"
import { extrinsic, extrinsicInfo } from "./extrinsic.ts"
import { pallet } from "./pallet.ts"
import { type } from "./type.ts"
import { typeVisitor } from "./typeVisitor.ts"

export interface CodegenCtxProps {
  metadata: Metadata
  clientFile: File
  rawClientFile?: File
}

export class Codegen {
  metadata
  clientFile

  typeVisitor
  files = new Map<string, File>()
  typeFiles = new Map<string, TypeFile>()

  constructor({ metadata, clientFile, rawClientFile }: CodegenCtxProps) {
    this.metadata = metadata
    this.clientFile = clientFile

    this.typeVisitor = typeVisitor(this)

    for (const [path, typeFile] of this.typeFiles) {
      const filePath = path + typeFile.ext
      this.files.set(filePath, type(this, path, filePath, typeFile))
    }

    this.files.set("codecs.ts", codecs(this))

    this.files.set("client/mod.ts", clientFile)
    if (rawClientFile) this.files.set("client/raw.ts", rawClientFile)

    const extrinsicInfo_ = extrinsicInfo(this)
    this.files.set("extrinsic.ts", extrinsic(this, extrinsicInfo_))

    const callTySrcPath = this.typeVisitor.visit(extrinsicInfo_.callTy)

    let palletNamespaceExports = ""
    for (const p of this.metadata.pallets) {
      if (!p.calls && !p.constants.length && !p.storage?.entries.length) continue
      this.files.set(`${p.name}.ts`, pallet(this, p, callTySrcPath))
      palletNamespaceExports += `export * as ${p.name} from "./${p.name}.ts"\n`
    }

    const mod = new File()
    mod.codeRaw = `
      export * from "./client/mod.ts"

      ${palletNamespaceExports}
    `
    this.files.set("mod.ts", mod)
  }

  [Symbol.iterator]() {
    return this.files[Symbol.iterator]()
  }
}

export class TypeFile {
  reexports = new Set<string>()
  types = new Map<string, Ty>()
  get ext() {
    return this.reexports.size ? "/mod.ts" : ".ts"
  }
}

export class File {
  codeRaw = ""

  code(filePath: string): string {
    return tsFormatter.formatText(filePath, this.codeRaw)
  }
}
