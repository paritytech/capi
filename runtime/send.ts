import { unimplemented } from "../_deps/std/testing/asserts.ts";
import * as core from "../fluent/mod.ts";

export type SendTarget = core.Signed | core.Call;

export function send<Target extends SendTarget>(
  target: Target,
): AsyncIterableIterator<unknown> {
  unimplemented();
}
