import { unimplemented } from "../_deps/asserts.ts";
import * as core from "../core/mod.ts";

export type SendTarget = core.Signed | core.Call;

export function send<Target extends SendTarget>(
  target: Target,
): AsyncIterableIterator<unknown> {
  unimplemented();
}
