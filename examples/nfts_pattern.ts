import { chain } from "http://localhost:4646/frame/zombienet/zombienets/nfts.toml/collator/@v0.9.370/chain"
import { $, alice } from "../mod.ts"
import { CollectionRune, signature } from "../patterns/nfts/mod.ts"

const metadata = $.object($.field("name", $.str))
const itemMetadata = $.object($.field("name", $.str), $.field("url", $.str), $.field("type", $.str))

const collection = CollectionRune.create({
  chain,
  admin: alice.address,
  metadata: { name: "Collection #1" },
  $codecs: { metadata, itemMetadata, attributes: $.never, itemAttributes: $.never },
  sig: signature({ sender: alice }),
})

const item = collection.mint({ id: 0, price: 100n, sig: signature({ sender: alice }) })
