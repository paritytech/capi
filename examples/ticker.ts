import * as C from "../mod.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";

const root = new C.EntryWatch(T.polkadot, "Timestamp", "Now", [], () => {
  let i = 0;
  return (m) => {
    console.log({ [i]: m });
    i++;
  };
});

U.throwIfError(await root.run());
