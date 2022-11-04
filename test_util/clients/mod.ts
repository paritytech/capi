import { client as kusama } from "./kusama.ts";
import { client as polkadot } from "./polkadot.ts";
import { client as rococo } from "./rococo.ts";
import { client as westend } from "./westend.ts";

export { kusama, polkadot, rococo, westend };
export const clients = { kusama, polkadot, rococo, westend };
