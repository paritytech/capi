import * as C from "../mod.ts";

const root = C.watchBlocks(C.westend, (stop) => {
  let i = 0;
  return ({ block }) => {
    console.log(block.header);
    if (i === 2) {
      stop();
    }
    i++;
  };
});

const maybeError = await root.run();

if (maybeError) {
  throw maybeError;
}
