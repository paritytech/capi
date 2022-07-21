import { unimplemented } from "../deps/std/testing/asserts.ts";
import * as core from "../fluent/mod.ts";

export type SendTarget = core.Signed | core.Call;

export function send<Target extends SendTarget>(
  _target: Target,
): AsyncIterableIterator<unknown> {
  unimplemented();
}
