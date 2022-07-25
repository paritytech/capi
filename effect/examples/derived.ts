import { polkadot } from "../../known/mod.ts";
import * as U from "../../util/mod.ts";
import * as Z from "../mod.ts";

const parachainIds = Z.readEntry(polkadot, "Paras", "Parachains", []);
const parachainHeads = Z.into([parachainIds], ({ value }) => {
  const atoms = value.map((id: number) => {
    return Z.readEntry(polkadot, "Paras", "Heads", [id]);
  });
  return Z.all(...atoms);
});
const result = U.throwIfError(await Z.run(parachainHeads));
console.log(result);
