import * as C from "../mod.ts";
import * as U from "../util/mod.ts";

const ids = new C.EntryRead(C.polkadot, "Paras", "Parachains", []);

// TODO: fix error –– client rc goes down to 1 before new reads initialized
// aka., client disconnects before the following reads are evaluated
const root = C.each(C.sel(ids, "value"), (id) => {
  return new C.EntryRead(C.polkadot, "Paras", "Heads", [id]);
});

// @ts-ignore for now
console.log(U.throwIfError(await C.run(root)));
