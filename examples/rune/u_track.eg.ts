/**
 * @title Rune U Track
 * @stability nearing
 * @description The `U` track allows for values such as errors and empty options
 * to be moved in and out of your purview. This can drastically simplify branching,
 * such as error recovery.
 */

import { assert, assertEquals, assertInstanceOf } from "asserts"
import { Rune, Unhandled } from "capi"

/// Define a custom error, potentially with a constructor accepting
/// some error-specific data (here we'll leave as is).
class MyError extends Error {
  override readonly name = "MyError"
}

/// Define some initial data, and turn it into a Rune (`initial`).
const INITIAL_MSG = "Hello world... or error"
const initial = Rune.constant(INITIAL_MSG)

/// Map over `initial`. Half the time, return the resolved value as is. The other
/// half, return an instance of the custom error.
const start = initial.map((value) => Math.random() > .5 ? new MyError() : value)

/// If we `unhandle` the error (move it to the `U` track), we can pretend it doesn't
/// exist. This lets us move quickly, although it's risky; half of the time, the
/// Rune's execution will throw an `Unhandled`, within which the intercepted `MyError`
/// instance resides. The other half of the time, we'll get our initial message.
try {
  const unhandled = await start.unhandle(MyError).run()
  console.log("Unhandled:", unhandled)
  assertEquals(unhandled, INITIAL_MSG)
} catch (e) {
  console.log("Unhandled:", e)
  assertInstanceOf(e, Unhandled)
  assertInstanceOf(e.value, MyError)
}

/// A better solution might be to `handle` the error. We can use `handle` along with
/// the error constructor or a type guard to specify some alternative execution.
const RECOVERY_MSG = "Smooth recovery"
const handled = await start.handle(MyError, () => Rune.constant(RECOVERY_MSG)).run()
console.log("Handled:", handled)
assert(handled === INITIAL_MSG || handled === RECOVERY_MSG)

/// We can also explicitly **re**handle that which has been unhandled.
const unReHandled = await start
  .unhandle(MyError)
  .map((msg) => `**${msg}**`)
  .rehandle(MyError)
  .run()
console.log("(Un|Re)handled:", unReHandled)
assert(unReHandled === `**${INITIAL_MSG}**` || unReHandled instanceof MyError)

/// When rehandling, we can optionally specify the alternative execution, as we do with `handle`.
const unReHandledWithFallback = await start
  .unhandle(MyError)
  .rehandle(MyError, () => Rune.constant(RECOVERY_MSG))
  .run()
console.log("(Un|Re)handled with fallback:", unReHandledWithFallback)
assert(unReHandledWithFallback === INITIAL_MSG || unReHandledWithFallback === RECOVERY_MSG)
