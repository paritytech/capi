import * as C from "../mod.ts";
import * as U from "../util/mod.ts";

const root = C.Entry.watch(C.rococo, "System", "Events", [], (stop) => {
  let i = 0;
  return (event) => {
    i++;
    console.log(event);
    if (i === 5) {
      stop();
    }
  };
});

U.throwIfError(await C.run(root));
