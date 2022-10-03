import * as C from "../mod.ts";
import * as t from "../test_util/mod.ts";
import * as U from "../util/mod.ts";

const config = await t.config();

const root = C.watchEntry(config, "Timestamp", "Now", [], () => {
  let i = 0;
  return (m) => {
    console.log({ [i]: m });
    i++;
  };
});

U.throwIfError(await root.run());

config.close();
