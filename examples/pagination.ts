import { Rune } from "capi"
import { System } from "polkadot_dev/mod.js"
import { Uniques } from "statemint/mod.js"

const accounts = System.Account.keyPage(10, null)

const collections = Uniques.Class.entryPage(10, null)

const result = await Rune
  .rec({ accounts, collections })
  .run()

console.log(result)
