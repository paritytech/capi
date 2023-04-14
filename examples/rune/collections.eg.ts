/**
 * @title Rune Collections
 * @stability nearing
 * @description Parallelize resolution and collect results.
 */

import { assertEquals } from "asserts"
import { Rune } from "capi"

// Begin with three arbitrary Runes. These could come from anywhere.
// In this case, we initialize them from string constants.
const a = Rune.constant("a")
const b = Rune.constant("b")
const c = Rune.constant("c")

// Use `Rune.tuple` to create a new Rune resolving to `[aT, bT]`.
const d = Rune.tuple([a, b])

// Use `Rune.object` to create a new Rune resolving to `{ c: cT, d: dT }`.
const e = Rune.object({ c, d })

// Execute `e`. Note the resolution of inner Runes is parallelized,
// much like a `Promise.all` call.
const result = await e.run()

// Ensure the result is of the expected shape.
console.log(result)
assertEquals(result, { c: "c", d: ["a", "b"] })
