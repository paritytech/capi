import { run } from "./codegen/mod.ts";
import { parse } from "./deps/std/flags.ts";

const args = parse(Deno.args, {
  string: ["metadata", "output"],
  boolean: ["help"],
  alias: {
    metadata: ["m"],
    output: ["out", "o"],
    help: ["h", "?"],
  },
});

if (args.help) {
  console.log("Usage: codegen --metadata <file> --output <dir>");
  Deno.exit(0);
}

if (!args.metadata) throw new Error("Must specify metadata file");
if (!args.output) throw new Error("Must specify output dir");

run(args.metadata, args.output);
