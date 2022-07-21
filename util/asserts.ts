import { assert } from "../_deps/std/testing/asserts.ts";

export function assertNotError<InQuestion>(
  inQuestion: InQuestion,
  message?: string,
): asserts inQuestion is Exclude<InQuestion, Error> {
  assert(!(inQuestion instanceof Error), message);
}
