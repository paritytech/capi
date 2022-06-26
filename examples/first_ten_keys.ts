import * as C from "../mod.ts";

const result = await C.polkadot
  .pallet("System")
  .entry("Account")
  .keyPage(10)
  .read();

console.log({ result });
