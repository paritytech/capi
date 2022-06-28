import { assert } from "../_deps/asserts.ts";
import { SubstrateNode, substrateNode } from "../util/mod.ts";

export async function node(): Promise<SubstrateNode> {
  const process = await substrateNode({
    path: "./node-template",
    cwd: new URL(".", import.meta.url).pathname,
    dev: true,
  });
  assert(!(process instanceof Error));
  return process;
}
