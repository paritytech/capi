import * as M from "../frame_metadata/mod.ts"
import { Files } from "./Files.ts"
import { genCodecs } from "./genCodecs.ts"
import { genMetadata } from "./genMetadata.ts"
import { createTypeVisitor } from "./typeVisitor.ts"

export interface CodegenProps {
  metadata: M.Metadata
}

export function codegen(props: CodegenProps): Files {
  const files = new Files()
  const typeVisitor = createTypeVisitor(props, files)
  files.set("codecs.ts", genCodecs(props, typeVisitor))
  genMetadata(props.metadata, typeVisitor, files)
  return files
}
