import { westend } from "../known/mod.ts";
import * as C from "../mod.ts";

const result = await C
  .chain(westend)
  .pallet("System")
  .entry("Events")
  .watch(console.log);

setTimeout(() => {
  if (typeof result === "function") {
    result();
  }
}, 10000);
