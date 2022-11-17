import * as M from "../frame_metadata/mod.ts"
import { Files } from "./Files.ts"
import { genCodecs } from "./genCodecs.ts"
import { genMetadata } from "./genMetadata.ts"
import { createTypeVisitor } from "./typeVisitor.ts"
import { S } from "./utils.ts"

export interface CodegenProps {
  metadata: M.Metadata
  importSpecifier: string
  clientFile: string
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
export const C = await import("" + ${S.string(props.importSpecifier)})
export const { $ } = C;
export const { client } = await import("" + ${S.string(props.clientFile)})
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
