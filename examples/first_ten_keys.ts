import { polkadot } from "../known/mod.ts";
import * as C from "../mod.ts";

const result = await C
  .chain(polkadot)
  .pallet("System")
  .entry("Account")
  .keyPage(10)
  .read();

console.log({ result });
