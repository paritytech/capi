import * as C from "../mod.ts";

const result = await C.westend
  .pallet("System")
  .entry("Events")
  .watch(console.log);

setTimeout(() => {
  if (typeof result === "function") {
    result();
  }
}, 10000);
