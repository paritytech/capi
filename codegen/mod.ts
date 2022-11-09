import * as M from "../frame_metadata/mod.ts"
import { createCodecVisitor } from "./codecVisitor.ts"
import { Files } from "./Files.ts"
import { genMetadata } from "./genMetadata.ts"
import { createTypeVisitor } from "./typeVisitor.ts"
import { Decl, printDecls, S } from "./utils.ts"

export interface CodegenProps {
  metadata: M.Metadata
  importSpecifier: string
}

export function codegen(props: CodegenProps): Files {
  const decls: Decl[] = []
  const files = new Files()
  const typeVisitor = createTypeVisitor(props, decls)
  const codecVisitor = createCodecVisitor(props, decls, typeVisitor, files)
  for (const ty of props.metadata.tys) {
    typeVisitor.visit(ty)
    codecVisitor.visit(ty)
  }
  genMetadata(props.metadata, decls, typeVisitor)
  files.set("capi.ts", { getContent: () => ["export * from", S.string(props.importSpecifier)] })
  printDecls(
    decls,
    (depth, isRoot) => [
      isRoot
        ? []
        : ["import type * as t from", S.string((depth ? "../".repeat(depth) : "./") + "mod.ts")],
      ["import * as _codec from", S.string((depth ? "../".repeat(depth) : "./") + "codecs.ts")],
      [
        "import { ChainError, BitSequence, Era, $ } from",
        S.string((depth ? "../".repeat(depth) : "./") + "capi.ts"),
      ],
    ],
    [],
    files,
  )
  return files
}
