import * as C from "../mod.ts";

const root = C.watchEntry(C.rococo, "System", "Events", [], (stop) => {
  let i = 0;
  return (event) => {
    i++;
    console.log(event);
    if (i === 5) {
      stop();
    }
  };
});

const maybeError = await root.run();

if (maybeError instanceof Error) {
  throw maybeError;
}
