import * as C from "../mod.ts";
import * as t from "../test-util/mod.ts";

await t.ctx(async (config) => {
  const result = await C
    .chain(config)
    .pallet("System")
    .entry("Account", t.anyPairs.alice.publicKey)
    .read();
  console.log(result);
});
