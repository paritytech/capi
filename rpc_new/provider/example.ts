import { start } from "../../deps/smoldot.ts";
import { Chain } from "../../deps/smoldot/client.d.ts";

const client = start({});

const polkadot: Chain = await client.addChain();

// async function loop() {
//   const message = await polkadot.nextJsonRpcResponse();
//   listener(JSON.parse(message));
//   await loop();
// }
// loop();
// loop();
// loop();
