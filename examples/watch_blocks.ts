import * as C from "../mod.ts";
import * as U from "../util/mod.ts";

const root = new C.BlockWatch(C.polkadot, (stop) => {
  let i = 0;
  return ({ block }) => {
    console.log(block.header);
    if (i === 2) {
      stop();
    }
    i++;
  };
});

U.throwIfError(await C.run(root));
