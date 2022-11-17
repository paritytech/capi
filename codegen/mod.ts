import * as M from "../frame_metadata/mod.ts"
import { Files } from "./Files.ts"
import { genCodecs } from "./genCodecs.ts"
import { genMetadata } from "./genMetadata.ts"
import { createTypeVisitor } from "./typeVisitor.ts"
import { S } from "./utils.ts"

export interface CodegenProps {
  metadata: M.Metadata
  importSpecifier: string
  clientDecl: string
}

export function codegen(props: CodegenProps): Files {
  const files = new Files()

  console.time("base")
  const typeVisitor = createTypeVisitor(props, files)

  files.set("codecs.ts", () => genCodecs(props, typeVisitor))

  genMetadata(props.metadata, typeVisitor, files)

  files.set(
    "capi.ts",
    () =>
      `\
export { $ } from ${S.string(props.importSpecifier)}
export * as C from ${S.string(props.importSpecifier)}
${props.clientDecl}
`,
  )

  files.set("mod.ts", () =>
    `\
export * as pallets from "./pallets/mod.ts"
export * as types from "./types/mod.ts"
export * as codecs from "./codecs.ts"

export * from "./extrinsic.ts"
`)
  console.timeEnd("base")

  return files
}
