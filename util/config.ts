import { assert } from "../_deps/asserts.ts";
import * as path from "../_deps/path.ts";

export function capiConfigDir(): string {
  const d = Deno.env.get("HOME");
  assert(d);
  return path.join(d, "config", "capi");
}
