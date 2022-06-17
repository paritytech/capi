import * as asserts from "../_deps/asserts.ts";
import "../_deps/load_dotenv.ts";

export function loadEnv<T extends Record<string, unknown>>(
  transformers: { [Key in keyof T]: (value: string) => T[Key] },
): T {
  const result: Partial<T> = {};
  for (const key in transformers) {
    const value = Deno.env.get(key);
    asserts.assert(value);
    result[key] = transformers[key](value);
  }
  return result as T;
}
