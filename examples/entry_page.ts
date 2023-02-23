import { Uniques } from "statemint/mod.ts"

const collections = Uniques.Class.entryPage(10)

const result = await collections.run()

console.log(result)
