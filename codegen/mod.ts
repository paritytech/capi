import * as M from "../frame_metadata/mod.ts";
import { createCodecVisitor } from "./codecVisitor.ts";
import { genMetadata } from "./genMetadata.ts";
import { createTypeVisitor } from "./typeVisitor.ts";
import { Decl, Files, importSource, printDecls, S } from "./utils.ts";

export function codegen(metadata: M.Metadata): Files {
  const decls: Decl[] = [];

  const { tys } = metadata;

  const files: Files = new Map();

  decls.push({
    path: "_",
    code: [
      "\n",
      ["import { ChainError, BitSequence, Era, $ } from", S.string(importSource)],
      [`import * as _codec from "./codecs.ts"`],
    ],
  });

  const typeVisitor = createTypeVisitor(tys, decls);
  const codecVisitor = createCodecVisitor(tys, decls, typeVisitor, files);

  for (const ty of metadata.tys) {
    typeVisitor.visit(ty);
    codecVisitor.visit(ty);
  }

  genMetadata(metadata, decls);

  files.set("mod.ts", { getContent: () => printDecls(decls) });

  return files;
}
