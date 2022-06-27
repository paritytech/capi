import { assert } from "../_deps/asserts.ts";
import { SubstrateProcess, substrateProcess } from "../util/mod.ts";

export async function node(): Promise<SubstrateProcess> {
  const process = await substrateProcess({
    path: "./node-template",
    cwd: new URL(".", import.meta.url).pathname,
    dev: true,
  });
  assert(!(process instanceof Error));
  return process;
}
