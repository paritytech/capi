import { sizeTree } from "capi/patterns/sizeTree.ts"
import { chain } from "polkadot_dev/mod.ts"

const result = await sizeTree(chain).run()

console.log(result)
