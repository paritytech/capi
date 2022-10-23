import * as gen from "../codegen/mod.ts";
import * as path from "../deps/std/path.ts";
import * as C from "../mod.ts";
import * as U from "../util/mod.ts";
import { TestConfig } from "./config.ts";

export type CodegenModule = any;
const memo = new Map<TestConfig, Promise<CodegenModule>>();
export function importCodegen(config: TestConfig) {
  return U.getOr(memo, config, async () => {
    const metadata = U.throwIfError(await C.run(new C.Metadata(config)));
    const outputDir = path.join(
      path.dirname(path.fromFileUrl(import.meta.url)),
      "../target/codegen/",
      config.runtimeName,
    );
    const output = gen.codegen(metadata);
    await gen.writeOutput(outputDir, output);
    return await import(path.toFileUrl(path.join(outputDir, "mod.ts")).toString());
  });
}
