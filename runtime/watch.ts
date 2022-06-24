import * as C from "../core/mod.ts";

export type WatchTarget = C.Entry | C.KeyPage | C.Metadata | C.Head;

export declare function watch<Target extends WatchTarget>(
  target: Target,
): AsyncIterableIterator<unknown>;
