import * as path from "../deps/std/path.ts"
import { Metadata } from "../frame_metadata/mod.ts"
import { Ty } from "../scale_info/mod.ts"

export interface CodegenCtxProps {
  metadata: Metadata
  capiMod: URL
  clientMod: URL
  baseDir: URL
}

export class CodegenCtx {
  metadata
  baseDir
  baseDirGhost
  capiMod
  clientMod

  files = new Map<string, string>()
  typeFiles = new Map<string, TypeFile>()

  constructor({ metadata, baseDir, capiMod, clientMod }: CodegenCtxProps) {
    this.metadata = metadata
    this.baseDir = baseDir
    this.baseDirGhost = path.join(this.baseDir.pathname, "_")
    this.capiMod = capiMod
    this.clientMod = clientMod
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
