import { run } from "./codegen/mod.ts";
import { parse } from "./deps/std/flags.ts";

const args = parse(Deno.args, {
  string: ["metadata", "output"],
});

if (args.help || args["?"]) {
  console.log("Usage: codegen --metadata <file> --output <dir>");
  Deno.exit(0);
}

if (!args.metadata) throw new Error("Must specify metadata file");
if (!args.output) throw new Error("Must specify output dir");

run(args.metadata, args.output);
