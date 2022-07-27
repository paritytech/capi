import * as t from "../../test-util/mod.ts";
import * as U from "../../util/mod.ts";
import * as Z from "../mod.ts";

await t.ctx(async (config) => {
  const read_ = Z.readEntry(config, "System", "Account", [t.anyPairs.alice.publicKey]);
  const result = U.throwIfError(await Z.run(read_));
  console.log(result.value);
});
