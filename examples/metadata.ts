import { polkadot } from "../known/mod.ts";
import * as C from "../mod.ts";

const result = await C
  .chain(polkadot)
  .metadata()
  .read();

console.log({ result });
