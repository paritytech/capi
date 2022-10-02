import * as C from "../mod.ts";
import * as t from "../test-util/mod.ts";

const config = await t.config();

const root = C.watchEntry(config, "Timestamp", "Now", [], () => {
  let i = 0;
  return (m) => {
    console.log({ [i]: m });
    i++;
  };
});

const maybeError = await root.run();

if (maybeError instanceof Error) {
  throw maybeError;
}

config.close();
