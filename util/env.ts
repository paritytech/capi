import { assert } from "../_deps/asserts.ts";

export function envGetSafe<T>(
  varName: string,
  transform: (raw: string) => T,
): T {
  const raw = Deno.env.get(varName);
  assert(raw);
  return transform(raw);
}
