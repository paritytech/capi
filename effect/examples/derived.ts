import * as C from "../../mod.ts";
import * as U from "../../util/mod.ts";

const ids = C.readEntry(C.polkadot, "Paras", "Parachains", []);
const root = C.into([ids], ({ value }) => {
  const heads = value.map((id: number) => {
    return C.readEntry(C.polkadot, "Paras", "Heads", [id]);
  });
  return C.all(...heads);
});

console.log(U.throwIfError(await root.run()));
