import { Uniques } from "zombienet/statemine.toml/collator/@latest/mod.ts";
import { alice } from "../util/mod.ts";

const collection = Uniques
  .create({
    collection: 11984,
    admin: alice.address,
  })
  .signed({ sender: alice })
  .sent()
  .txEvents()
  .dbg("collections");

/* const item = Uniques.mint({
  collection: 1,
  item: 0,
  owner: alice.address,
}).signed({ sender: alice })
  .sent()
  .txEvents()
  .dbg("item");
 */
/* const metadata = Uniques.setMetadata({
  collection: collection,
  item: item,
  data: [],
});

const collections = Uniques.Class.entry();

Uniques.Asset.entry([0, 0]);

Uniques.ItemPriceOf.entry([0, 0]); */

await (collection.run());
//await (collection.chain(() => item).run());

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
