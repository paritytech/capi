import * as t from "../../test-util/mod.ts";
import * as U from "../../util/mod.ts";
import { run } from "../run.ts";
import { readBlock } from "../std/block/read.ts";

t.ctx(async (config) => {
  const read_ = readBlock(config);
  const result = U.throwIfError(await run(read_));
  console.log(result.block);
});
