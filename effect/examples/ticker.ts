import * as t from "../../test-util/mod.ts";
import * as U from "../../util/mod.ts";
import * as Z from "../mod.ts";

await t.ctx(async (config) => {
  const subscription = Z.watchEntry(config, "Timestamp", "Now", [], () => {
    return (m) => {
      console.log(m);
    };
  });
  U.throwIfError(await Z.run(subscription));
});
