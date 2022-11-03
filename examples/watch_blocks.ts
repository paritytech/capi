import * as C from "../mod.ts";
import * as U from "../util/mod.ts";

const root = C.blockWatch(C.polkadot)(function({ block }) {
  console.log(block.header);
  const counter = this.state(U.Counter);
  if (counter.i === 2) {
    return this.stop();
  }
  counter.inc();
});

U.throwIfError(await C.run(root));
