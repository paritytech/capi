import * as C from "../core/mod.ts";

export type ReadTarget = C.Entry | C.KeyPage | C.Metadata | C.Head;

export async function read<Target extends ReadTarget = ReadTarget>(
  target: Target,
  block?: C.Block<Target["chain"]>,
): Promise<unknown> {
  switch (target.kind) {
    case "Entry": {
      return Promise.resolve("SOON");
    }
    default: {
      return Promise.resolve("UNIMPLEMENTED");
    }
  }
}
