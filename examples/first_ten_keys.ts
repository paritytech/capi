import * as C from "../mod.ts";
import * as t from "../test-util/mod.ts";

await t.ctx(async (config) => {
  const result = await C
    .chain(config)
    .pallet("System")
    .entry("Account")
    .keyPage(10)
    .read();
  console.log(result);
});
