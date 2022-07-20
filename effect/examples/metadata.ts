import * as t from "../../test-util/mod.ts";
import * as U from "../../util/mod.ts";
import { metadata } from "../atoms/Metadata.ts";
import { run } from "../run.ts";

t.ctx(async (config) => {
  const read_ = metadata(config);
  const result = U.throwIfError(await run(read_));
  console.log(result);
});
