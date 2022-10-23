import { tsFormatter } from "../deps/dprint.ts";
import * as path from "../deps/std/path.ts";
import * as M from "../frame_metadata/mod.ts";
import { createCodecVisitor } from "./codecVisitor.ts";
import { genMetadata } from "./genMetadata.ts";
import { createTypeVisitor } from "./typeVisitor.ts";
import { Decl, Files, importSource, printDecls, S } from "./utils.ts";

export async function run(metadataFile: string, outputDir: string) {
  const metadata = M.fromPrefixedHex(await Deno.readTextFile(metadataFile));
  const output = codegen(metadata);
  await writeOutput(outputDir, output);
}

export async function writeOutput(outputDir: string, output: Files) {
  const errors = [];
  try {
    await Deno.remove(outputDir, { recursive: true });
  } catch (e) {
    if (!(e instanceof Deno.errors.NotFound)) {
      throw e;
    }
  }
  await Deno.mkdir(outputDir, { recursive: true });
  for (const [relativePath, file] of output.entries()) {
    const outputPath = path.join(outputDir, relativePath);
    const content = S.toString(file.getContent());
    try {
      const formatted = tsFormatter.formatText("gen.ts", content);
      await Deno.writeTextFile(outputPath, formatted);
    } catch (e) {
      await Deno.writeTextFile(outputPath, content);
      errors.push(e);
    }
  }
  if (errors.length) {
    throw errors;
  }
}

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
      [`export { _metadata }`],
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
