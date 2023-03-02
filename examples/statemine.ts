import { Uniques } from "zombienet/statemine.toml/collator/@latest/mod.ts";
import { alice } from "../util/mod.ts";

const collection = Uniques
  .create({
    collection: 11985,
    admin: alice.address,
  })
  .signed({ sender: alice, tip: 4000000n })
  .sent()
  .txEvents()
  .dbgStatus("collections");

const item = Uniques.mint({
  collection: 1,
  item: 0,
  owner: alice.address,
}).signed({ sender: alice })
  .sent()
  .txEvents()
  .
  .dbg("item");
 
const metadata = Uniques.setMetadata({
  collection: collection,
  item: item,
  data: [],
});

const collections = Uniques.Class.entry();

Uniques.Asset.entry();

Uniques.Class.keyPage(10);
const owo = Uniques.Class.entry([1]);
const sla = Uniques.Account.entry([])

Uniques.ItemPriceOf.entry([0, 0]);
Uniques.setPrice()
Uniques.buyItem()

/* const aliceRatify = Proxy
  .proxy({
    real: aliceProxyAddress,
    forceProxyType: undefined,
    call: multisig.ratify({
      call: proposalCall,
      sender: aliceProxyAddress,
    }),
  })
  .signed({ sender: alice })
  .sent()
  .dbgStatus("Ratify Proposal Alice:")
  .finalized()
 */
console.log("lala");
