import * as C from "../mod.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";

const root = C.watchEntry(T.polkadot, "Timestamp", "Now", [], (stop) => {
  let i = 0;
  return (m) => {
    i++;
    console.log({ [i]: m });
    if (i === 5) {
      stop();
    }
  };
});

U.throwIfError(await root.run());
