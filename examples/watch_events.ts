import * as C from "../mod.ts";
import * as U from "../util/mod.ts";

const root = C
  .chain(C.westend)
  .pallet("System")
  .entry("Events")
  .watch((stop) => {
    let i = 0;
    return (event) => {
      i++;
      console.log(event);
      if (i === 5) {
        stop();
      }
    };
  });

U.throwIfError(await root.run());
