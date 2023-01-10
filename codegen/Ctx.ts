import { Metadata } from "../frame_metadata/mod.ts"
import { Ty } from "../scale_info/mod.ts"
import { codecs } from "./codecs.ts"
import { extrinsic } from "./extrinsic.ts"
import { pallet } from "./pallet.ts"
import { type } from "./type.ts"
import { typeVisitor } from "./typeVisitor.ts"

export interface CodegenCtxProps {
  metadata: Metadata
  capiUrl: URL
  clientFile: File
  rawClientFile?: File
}

export class CodegenCtx {
  metadata
  capiMod
  clientFile

  typeVisitor
  files = new Map<string, File>()
  typeFiles = new Map<string, TypeFile>()

  constructor({ metadata, capiUrl, clientFile, rawClientFile }: CodegenCtxProps) {
    this.metadata = metadata
    this.capiMod = capiUrl
    this.clientFile = clientFile

    this.typeVisitor = typeVisitor(this)

    for (const [path, typeFile] of this.typeFiles) {
      const filePath = path + typeFile.ext
      this.files.set(filePath, type(this, path, filePath, typeFile))
    }

    this.files.set("_/codecs.ts", codecs(this))

    // TODO: deferred import formation system
    const capiReexportFile = new File()
    capiReexportFile.code = `export * from "${this.capiMod.href}"`
    this.files.set("_/capi.ts", capiReexportFile)

    // TODO: deferred import formation system
    this.files.set("_/client.ts", clientFile)
    if (rawClientFile) this.files.set("_/client/raw.ts", rawClientFile)

    this.files.set("extrinsic.ts", extrinsic(this))

    for (const p of this.metadata.pallets) {
      if (!p.calls && !p.constants.length && !p.storage?.entries.length) continue
      this.files.set(`${p.name}.ts`, pallet(this, p))
    }
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
  code = ""
}

export type Ext = "" | ".js" | ".ts"
