import * as path from "../deps/std/path.ts"
import { Metadata } from "../frame_metadata/mod.ts"
import { Ty } from "../scale_info/mod.ts"
import { codecs } from "./codecs.ts"
import { extrinsic } from "./extrinsic.ts"
import { pallet } from "./pallet.ts"
import { type } from "./type.ts"
import { typeVisitor } from "./typeVisitor.ts"

export interface CodegenCtxProps {
  metadata: Metadata
  capiMod: URL
  clientMod: URL
  clientRawMod: URL
  baseDir: URL
}

export class CodegenCtx {
  metadata
  baseDir
  baseDirGhost
  capiMod
  clientMod
  clientRawMod
  typeVisitor
  files = new Map<string, string>()
  typeFiles = new Map<string, TypeFile>()

  constructor({ metadata, baseDir, capiMod, clientMod, clientRawMod }: CodegenCtxProps) {
    this.metadata = metadata
    this.baseDir = baseDir
    this.baseDirGhost = path.join(this.baseDir.pathname, "_")
    this.capiMod = capiMod
    this.clientMod = clientMod
    this.clientRawMod = clientRawMod

    this.typeVisitor = typeVisitor(this)

    for (const [path, typeFile] of this.typeFiles) {
      const filePath = path + typeFile.ext
      this.files.set(filePath, type(this, path, filePath, typeFile))
    }

    this.files.set("_/codecs.ts", codecs(this))
    this.files.set("_/capi.ts", `export * from "${this.importSpecifier(this.capiMod)}"`)
    this.files.set("_/client.ts", `export * from "${this.importSpecifier(this.clientMod)}"`)
    this.files.set("_/client/raw.ts", `export * from "${this.importSpecifier(this.clientRawMod)}"`)
    this.files.set("_/extrinsic.ts", extrinsic(this))
    this.files.set("mod.ts", `export * from "./_/extrinsic.ts"`)

    for (const p of this.metadata.pallets) {
      if (!p.calls && !p.constants.length && !p.storage?.entries.length) continue
      this.files.set(`${p.name}.ts`, pallet(this, p))
    }
  }

  importSpecifier(url: URL) {
    return path.relative(this.baseDirGhost, url.pathname)
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
