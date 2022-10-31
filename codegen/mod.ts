import * as path from "../deps/std/path.ts";
import * as M from "../frame_metadata/mod.ts";
import { createCodecVisitor } from "./codecVisitor.ts";
import { Files } from "./Files.ts";
import { genMetadata } from "./genMetadata.ts";
import { createTypeVisitor } from "./typeVisitor.ts";
import { Decl, printDecls, S } from "./utils.ts";

export interface CodegenProps {
  metadata: M.Metadata;
  importSpecifier: string;
  outDir: string;
}

export function codegen(props: CodegenProps): Files {
  const decls: Decl[] = [];
  const files = new Files(props.outDir);
  decls.push({
    path: "_",
    code: [
      "\n",
      [
        "import { ChainError, BitSequence, Era, $ } from",
        S.string(path.relative(Deno.cwd(), props.importSpecifier)),
      ],
      [`import * as _codec from "./codecs.ts"`],
      [`export { _metadata }`],
    ],
  });
  const typeVisitor = createTypeVisitor(props, decls);
  const codecVisitor = createCodecVisitor(props, decls, typeVisitor, files);
  for (const ty of props.metadata.tys) {
    typeVisitor.visit(ty);
    codecVisitor.visit(ty);
  }
  genMetadata(props.metadata, decls);
  files.set("mod.ts", {
    getContent: () => printDecls(decls),
  });
  return files;
}
