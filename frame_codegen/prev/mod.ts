import { FrameChainSourceFileIter } from "/codegen/frame/Chain.ts";
import { Config } from "/config/mod.ts";
import * as asserts from "std/testing/asserts.ts";
import ts from "typescript";

export async function* SourceFileIter(config: Config): AsyncGenerator<ts.SourceFile, void, void> {
  for (const [alias, resource] of Object.entries(config.raw.chains)) {
    if (typeof resource !== "string") {
      asserts.unimplemented();
    }
    yield* FrameChainSourceFileIter(config, alias, resource);
  }
}
