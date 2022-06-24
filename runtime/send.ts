import * as C from "../core/mod.ts";

export type SendTarget = C.Signed | C.Call;

export declare function send<Target extends SendTarget>(
  target: Target,
): AsyncIterableIterator<unknown>;
