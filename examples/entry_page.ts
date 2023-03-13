import { Uniques } from "statemint/mod.js"

const collections = Uniques.Class.entryPage(10, null)

const result = await collections.run()

console.log(result)
