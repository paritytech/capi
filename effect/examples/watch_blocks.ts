import * as C from "../../mod.ts";
import * as U from "../../util/mod.ts";

const root = C.watchBlocks(C.polkadot, (stop) => {
  let i = 0;

  return (event) => {
    console.log(event);
    if (i === 4) {
      stop();
    }
    i++;
  };
});

console.log(U.throwIfError(await root.run()));
