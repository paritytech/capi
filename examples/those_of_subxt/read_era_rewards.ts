import * as C from "../../mod.ts";

const idx = C.readEntry(C.polkadot, "Staking", "ActiveEra", [])
  .select("value")
  .select("index");

const eraRewardPoints = C.readEntry(C.polkadot, "Staking", "ErasRewardPoints", [idx]);

const result = await eraRewardPoints.run();

if (result instanceof Error) {
  throw result;
}
console.log(result);
