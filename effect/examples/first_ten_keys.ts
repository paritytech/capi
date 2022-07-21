import * as t from "../../test-util/mod.ts";
import * as U from "../../util/mod.ts";
import { run } from "../run.ts";
import { readKeys } from "../std/keys/read.ts";

t.ctx(async (config) => {
  const read_ = readKeys(config, "System", "Account", 10);
  const result = U.throwIfError(await run(read_));
  console.log(result.keys);
});
