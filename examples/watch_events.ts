import { westend } from "../known/mod.ts";
import * as C from "../mod.ts";

// TODO: wire up with new subscription interface
const result = await C
  .chain(westend)
  .pallet("System")
  .entry("Events")
  .watch(console.log);
