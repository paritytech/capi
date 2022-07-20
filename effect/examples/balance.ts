import * as t from "../../test-util/mod.ts";
import * as U from "../../util/mod.ts";
import { run } from "../run.ts";
import { readEntry } from "../std/entry/read.ts";

t.ctx(async (config) => {
  const read_ = readEntry(config, "System", "Account", [t.pairs.alice.public]);
  const result = U.throwIfError(await run(read_));
  console.log(result.value);
});
