import * as Z from "../../effect/mod.ts";
import * as t from "../../test-util/mod.ts";
import * as U from "../../util/mod.ts";

const config = await t.config();

const aliceStash = t.alice.derive("//stash");
const aliceBonded = Z.readEntry(config, "Staking", "Bonded", [aliceStash.publicKey]);
const result = U.throwIfError(await aliceBonded.run());
console.log(result);

config.close();
