import * as t from "../../test-util/mod.ts";
import * as U from "../../util/mod.ts";
import * as Z from "../mod.ts";

await t.ctx(async (config) => {
  const subscription = Z.watchEntry(config, "Timestamp", "Now", [], (stop) => {
    let i = 0;
    return (m) => {
      i++;
      console.log(m);
      if (i > 4) {
        stop();
      }
    };
  });
  U.throwIfError(await Z.run(subscription));
});
