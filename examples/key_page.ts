import { System } from "polkadot_dev/mod.js"

const page = await System.Account
  .keyPage(10, null)
  .run()

console.log(page)
