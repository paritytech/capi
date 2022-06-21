import * as C from "../mod.ts";

const multi = C.polkadot.address
  .fromSs58Text("13SceNt2ELz3ti4rnQbY1snpYH4XE4fLFsW8ph9rpwJd6HFC")
  .asMultiAddress();

const result = await C.polkadot
  .pallet("System")
  .entry("Account", [multi])
  .read();

console.log({ result });
