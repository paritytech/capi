import * as C from "../mod.ts";

console.log(
  await C.watchBlocks(C.westend, (stop) => {
    let i = 0;
    return ({ block }) => {
      console.log(block.header);
      if (i === 2) {
        stop();
      }
      i++;
    };
  }).run(),
);
