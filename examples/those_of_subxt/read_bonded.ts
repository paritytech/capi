import * as Z from "../../effect/mod.ts";
import * as t from "../../test-util/mod.ts";
import * as U from "../../util/mod.ts";

await t.ctx(async (config) => {
  const aliceStash = t.p.alice.derive("//stash");
  const aliceBonded = Z.readEntry(config, "Staking", "Bonded", [aliceStash.publicKey]);
  const result = U.throwIfError(await Z.run(aliceBonded));
  console.log(result);
});
