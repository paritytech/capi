import * as C from "../mod.ts";
import * as U from "../util/mod.ts";

const ids = new C.EntryRead(C.polkadot, "Paras", "Parachains", []);

const root = C.into([ids], ({ value }) => {
  const heads = value.map((id: number) => {
    return new C.EntryRead(C.polkadot, "Paras", "Heads", [id]);
  });
  return C.all(...heads);
});

console.log(U.throwIfError(await C.run(root)));
