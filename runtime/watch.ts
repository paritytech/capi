import * as core from "../core/mod.ts";

export type WatchTarget = core.Entry | core.KeyPage | core.Metadata | core.Header | core.Block;

export declare function watch<Target extends WatchTarget>(
  target: Target,
): AsyncIterableIterator<unknown>;
