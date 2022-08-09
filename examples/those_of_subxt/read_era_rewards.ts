import * as C from "../../mod.ts";
import * as U from "../../util/mod.ts";

const idx = C
  .readEntry(C.polkadot, "Staking", "ActiveEra", [])
  .select("value")
  .select("index");
const eraRewardPoints = C.readEntry(C.polkadot, "Staking", "ErasRewardPoints", [idx]);

console.log(U.throwIfError(await eraRewardPoints.run()));
