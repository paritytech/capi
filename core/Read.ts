import { Block } from "./Block.ts";
import { Entry } from "./Entry.ts";
import { Head } from "./Head.ts";
import { KeyPage } from "./KeyPage.ts";
import { Metadata } from "./Metadata.ts";

export class Read<
  Target extends Entry | KeyPage | Metadata | Head = Entry | KeyPage | Metadata | Head,
> extends Promise<"SOON"> {
  chain;

  constructor(
    readonly target: Target,
    readonly block?: Block<Target["chain"]>,
  ) {
    super((resolve, reject) => {
      switch (target.kind) {}
    });
    this.chain = target.chain;
  }
}
