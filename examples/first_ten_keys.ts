import * as C from "../mod.ts";

const result = C.polkadot
  .pallet("System")
  .entry("Account")
  .keyPage(10)
  .read();

console.log({ result });
