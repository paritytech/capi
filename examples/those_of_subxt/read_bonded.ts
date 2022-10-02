import * as C from "../../mod.ts";
import * as t from "../../test-util/mod.ts";

const config = await t.config();

const aliceStash = t.alice.derive("//stash");

const aliceBonded = C.readEntry(config, "Staking", "Bonded", [aliceStash.publicKey]);

const result = await aliceBonded.run();

if (result instanceof Error) {
  throw result;
}
console.log(result);

config.close();
