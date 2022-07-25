import { polkadot } from "../../known/mod.ts";
import * as U from "../../util/mod.ts";
import { readEntry } from "../std/entry/read.ts";
import { all, into, run } from "../sys/mod.ts";

const parachainIds = readEntry(polkadot, "Paras", "Parachains", []);
const parachainHeads = into([parachainIds], ({ value }) => {
  const atoms = value.map((id: number) => {
    return readEntry(polkadot, "Paras", "Heads", [id]);
  });
  return all(...atoms);
});
const result = U.throwIfError(await run(parachainHeads));
console.log(result);
