// TODO: Decide whether we want to make anything of the following DX.
//       The main issue here is that the `T` of `watchIter` is `unknown`.
//       We could fix this by turning `watchBlocks`'s `run` into an assertion.
//       **Dangerous**.

import * as C from "../mod.ts";

const watchIter = C.watchIter();

C.run(C.blockWatch(C.rococo, watchIter));

let i = 0;

for await (const block of watchIter) {
  console.log({ [i]: block });
  if (i === 5) {
    break;
  }
  i++;
}
