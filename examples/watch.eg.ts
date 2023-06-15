/**
 * @title Watch
 * @stability unstable
 * @description Capi allows you to model your data requirements as Runes and
 * then utilize `watch`, which produces an async generator, the pulls of which
 * produce promises resolving to subsequent states.
 */

import { polkadot } from "@capi/polkadot"
import { $, Scope } from "capi"

/// Specifying `chain.latestBlockHash` indicates that (A) this Rune tree
/// can be treated as reactive and (B) is a dependent of a "timeline" associated
/// with Polkadot's block production.
const now = polkadot.Timestamp.Now.value(undefined, polkadot.latestBlockHash)

/// Create a simple counter so that we can break iteration at 3.
let i = 0

/// Use the `watch` method to retrieve an async iterable, which will
/// gather and yield the `collection`-described data upon new blocks.
for await (const item of now.iter(new Scope())) {
  console.log(item)
  $.assert($.u64, item)
  if (++i === 3) break
}
