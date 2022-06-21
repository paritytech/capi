import * as C from "../mod.ts";

const ss58 = C.polkadot.address.fromSs58Text("13SceNt2ELz3ti4rnQbY1snpYH4XE4fLFsW8ph9rpwJd6HFC");

const result = await C.polkadot
  .pallet("System")
  .entry("Account", [ss58])
  .read();

console.log({ result });
