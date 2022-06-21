import { Entry } from "./Entry.ts";
import { Head } from "./Head.ts";
import { KeyPage } from "./KeyPage.ts";
import { Metadata } from "./Metadata.ts";

export type WatchTarget = Entry | KeyPage | Metadata | Head;

export class Watch<Target extends WatchTarget = WatchTarget>
  implements AsyncIterableIterator<unknown>
{
  constructor(readonly target: Target) {}

  // TODO
  next = undefined as any;

  [Symbol.asyncIterator]() {
    return this;
  }

  // TODO
  declare stop: () => void;
}
