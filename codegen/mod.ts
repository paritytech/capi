import * as M from "../frame_metadata/mod.ts"
import { Files } from "./Files.ts"
import { genCodecs } from "./genCodecs.ts"
import { genMetadata } from "./genMetadata.ts"
import { createTypeVisitor } from "./typeVisitor.ts"

export interface CodegenProps {
  metadata: M.Metadata
  capi: string
}

export function codegen(props: CodegenProps): Files {
  const files = new Files()
  const typeVisitor = createTypeVisitor(props, files)
  files.set("_/codecs.ts", genCodecs(props, typeVisitor))
  console.log(props.capi)
  files.set("_/capi.ts", `export * from "${props.capi}"`)
  genMetadata(props, typeVisitor, files)
  return files
}
