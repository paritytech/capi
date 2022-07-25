import { polkadot } from "../../known/mod.ts";
import * as U from "../../util/mod.ts";
import * as Z from "../mod.ts";

const subscription = Z.watchEntry(polkadot, "Timestamp", "Now", [], () => {
  return (m) => {
    console.log(m);
  };
});
U.throwIfError(await Z.run(subscription));
