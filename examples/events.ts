import { westend } from "../known/mod.ts";
import * as C from "../mod.ts";

const result = await C
  .chain(westend)
  .pallet("System")
  .entry("Events")
  .read();

console.log({ result });
