import { assert } from "../_deps/asserts.ts";
import { SubstrateNode, substrateNode } from "../util/mod.ts";

export interface TestNodeConfig {
  cloneDir: string;
  cwd?: string;
}

export async function node(config: TestNodeConfig): Promise<SubstrateNode> {
  const process = await substrateNode({
    repo: "git@github.com:substrate-developer-hub/substrate-node-template.git",
    cloneDir: config.cloneDir,
    cwd: config.cwd || Deno.cwd(),
    ensureSynced: false,
    recompile: false,
  });
  assert(!(process instanceof Error));
  return process;
}
