import * as C from "../mod.ts";

const result = await C.westend
  .pallet("System")
  .entry("Events")
  .read();

console.log({ result });
