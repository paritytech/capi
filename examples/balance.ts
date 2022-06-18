import { polkadotBeacon } from "../known/polkadot.ts";
import * as C from "../mod.ts";
import { rpcClient } from "../rpc/mod.ts";

const client = await rpcClient(polkadotBeacon);

const ss58 = C.ss58FromText("13SceNt2ELz3ti4rnQbY1snpYH4XE4fLFsW8ph9rpwJd6HFC");
const pubKey = C.pubKeyFromSs58(ss58);
const accountId32 = C.accountId32FromPubKey(pubKey);
const pallet = C.pallet(client, "System");
const map = C.map(pallet, "Account");
const entry = C.mapEntry(map, accountId32);
const result = await C.read(entry).run();

console.log({ result });

client.close();
