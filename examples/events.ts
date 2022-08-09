import * as C from "../mod.ts";
import * as U from "../util/mod.ts";

const root = C
  .chain(C.polkadot)
  .pallet("System")
  .entry("Events")
  .read();

console.log(U.throwIfError(await root.run()));
