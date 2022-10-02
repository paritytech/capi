import * as C from "../mod.ts";

const root = C.readEntry(C.westend, "System", "Events", []);

const result = await root.run();

if (result instanceof Error) {
  throw result;
}
console.log(result);
