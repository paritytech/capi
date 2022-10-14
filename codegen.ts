import { codegen } from "./codegen/mod.ts";
import { S } from "./codegen/utils.ts";
import { tsFormatter } from "./deps/dprint.ts";
import { parse } from "./deps/std/flags.ts";
import * as path from "./deps/std/path.ts";
import * as M from "./frame_metadata/mod.ts";

const { help, metadata: metadataPath, output: outDir } = parse(Deno.args, {
  string: ["metadata", "output"],
  boolean: ["help"],
  alias: {
    metadata: ["m"],
    output: ["out", "o"],
    help: ["h", "?"],
  },
});
if (help) {
  console.log("Usage: capi codegen --metadata <file> --output <dir>");
  Deno.exit(0);
}
if (!metadataPath) throw new Error("Must specify metadata file");
if (!outDir) throw new Error("Must specify output dir");

const metadata = M.fromPrefixedHex(await Deno.readTextFile(metadataPath));
const output = codegen(metadata);
const errors = [];
try {
  await Deno.remove(outDir, { recursive: true });
} catch (e) {
  if (!(e instanceof Deno.errors.NotFound)) {
    throw e;
  }
}
await Deno.mkdir(outDir, { recursive: true });
for (const [relativePath, file] of output.entries()) {
  const outputPath = path.join(outDir, relativePath);
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
