import { unimplemented } from "../_deps/asserts.ts";
import * as C from "../core/mod.ts";

export type SendTarget = C.Signed | C.Call;

export function send<Target extends SendTarget>(
  target: Target,
): AsyncIterableIterator<unknown> {
  unimplemented();
}
