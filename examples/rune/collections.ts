import { assertEquals } from "asserts"
import { Rune } from "capi"

const a = Rune.constant("a")
const b = Rune.constant("b")
const c = Rune.constant("c")

const d = Rune.tuple([a, b])
const e = Rune.rec({ c, d })

const result = await e.run()

assertEquals(result, { c: "c", d: ["a", "b"] })
