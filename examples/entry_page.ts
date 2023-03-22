import { Uniques } from "statemint/mod.js"

const page = await Uniques.Class
  .entryPage(10, null)
  .run()

console.log(page)
