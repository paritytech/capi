import { westend } from "../known/mod.ts";
import * as C from "../mod.ts";

await C
  .chain(westend)
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
