import { tsFormatter } from "../deps/dprint.ts";
import { parse } from "../deps/std/flags.ts";
import * as path from "../deps/std/path.ts";
import * as M from "../frame_metadata/mod.ts";
import { createCodecVisitor } from "./codecVisitor.ts";
import { genMetadata } from "./genMetadata.ts";
import { createTypeVisitor } from "./typeVisitor.ts";
import { Decl, Files, importSource, printDecls, S } from "./utils.ts";

if (import.meta.main) {
  const args = parse(Deno.args, {
    string: ["metadata", "output"],
  });
  if (args.help || args["?"]) {
    console.log("Usage: codegen --metadata <file> --output <dir>");
    Deno.exit(0);
  }
  if (!args.metadata) throw new Error("Must specify metadata file");
  if (!args.output) throw new Error("Must specify output dir");
  const { metadata: metadataFile, output: outputDir } = args;
  const metadata = M.fromPrefixedHex(await Deno.readTextFile(metadataFile));
  const output = codegen(metadata);
  const errors = [];
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
    console.error(errors);
    Deno.exit(1);
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
    ],
  });

  const typeVisitor = createTypeVisitor(tys, decls);
  const codecVisitor = createCodecVisitor(tys, decls, typeVisitor, files);

  typeVisitor.tys.map((x) => typeVisitor.visit(x));
  codecVisitor.tys.map((x) => codecVisitor.visit(x));

  genMetadata(metadata, decls);

  files.set("mod.ts", { getContent: () => printDecls(decls) });

  return files;
}
