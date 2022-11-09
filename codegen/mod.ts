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
  files.set("capi.ts", {
    getContent: () => [
      "\n",
      ["export { $ } from", S.string(props.importSpecifier)],
      ["export * as C from", S.string(props.importSpecifier)],
    ],
  })
  printDecls(
    decls,
    (depth, content) => [
      /\bt\./.test(content)
        ? ["import type * as t from", S.string((depth ? "../".repeat(depth) : "./") + "mod.ts")]
        : [],
      /\b_codec\./.test(content)
        ? ["import * as _codec from", S.string((depth ? "../".repeat(depth) : "./") + "codecs.ts")]
        : [],
      /(\W\$|\bC)\./.test(content)
        ? [
          "import {",
          /\W\$\./.test(content) ? "$," : "",
          /\bC\./.test(content) ? "C," : "",
          "} from",
          S.string((depth ? "../".repeat(depth) : "./") + "capi.ts"),
        ]
        : [],
    ],
    [],
    files,
  )
  return files
}
