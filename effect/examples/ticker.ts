import { polkadot } from "../../known/mod.ts";
import * as U from "../../util/mod.ts";
import { run } from "../run.ts";
import { watchEntry } from "../std/entry/watch.ts";

const subscription = watchEntry(polkadot, "Timestamp", "Now", [], () => {
  return (m) => {
    console.log(m);
  };
});
U.throwIfError(await run(subscription));
