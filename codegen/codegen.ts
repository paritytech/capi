import { tsFormatter } from "../deps/dprint.ts";
import { parse } from "../deps/std/flags.ts";
import * as M from "../frame_metadata/mod.ts";
import { createCodecVisitor } from "./codecVisitor.ts";
import { genMetadata } from "./genMetadata.ts";
import { createTypeVisitor } from "./typeVisitor.ts";
import { Decl, printDecls, S } from "./utils.ts";

const importSource = new URL("../mod.ts", import.meta.url).toString();

if (import.meta.main) {
  const args = parse(Deno.args, {
    string: ["metadata", "output"],
  });
  if (args.help || args["?"]) {
    console.log("Usage: codegen --metadata <file> --output <file>");
    Deno.exit(0);
  }
  if (!args.metadata) throw new Error("Must specify metadata file");
  if (!args.output) throw new Error("Must specify output file");
  const { metadata: metadataFile, output: outputFile } = args;
  const metadata = M.fromPrefixedHex(await Deno.readTextFile(metadataFile!));
  const output = codegen(metadata);
  try {
    const formatted = tsFormatter.formatText("gen.ts", output);
    await Deno.writeTextFile(outputFile!, formatted);
  } catch (e) {
    await Deno.writeTextFile(outputFile!, output);
    throw e;
  }
}

export function codegen(metadata: M.Metadata) {
  const decls: Decl[] = [];

  const { tys } = metadata;

  decls.push({
    path: "_",
    code: [
      "import { ChainError, BitSequence, Era, $, $null, $era } from",
      S.string(importSource),
    ],
  });

  const typeVisitor = createTypeVisitor(tys, decls);
  const codecVisitor = createCodecVisitor(tys, decls, typeVisitor);

  typeVisitor.tys.map((x) => typeVisitor.visit(x));
  codecVisitor.tys.map((x) => codecVisitor.visit(x));

  genMetadata(metadata, decls, codecVisitor);

  return printDecls(decls);
}
