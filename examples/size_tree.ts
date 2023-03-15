import { sizeTree } from "capi/patterns/sizeTree.ts"
import { chain } from "polkadot_dev/mod.js"

const result = await sizeTree(chain).run()

console.log(result)
