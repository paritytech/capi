import * as C from "../mod.ts";
import * as U from "../util/mod.ts";

const root = C.entryWatch(C.rococo)("System", "Events", [], function(entry) {
  console.log(entry);
  const counter = this.state(U.Counter);
  if (counter.i === 2) {
    return this.stop();
  }
  counter.inc();
});

U.throwIfError(await root.run());
