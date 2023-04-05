/**
 * @title Rune U Track
 * @stability nearing
 * @description Rune U Track
 * @todo
 */

import { assert, assertEquals, assertInstanceOf } from "asserts"
import { Rune } from "capi"

class MyError extends Error {
  override readonly name = "MyError"
}

const INITIAL_MSG = "Hello world... or error"
const start = Rune.constant(INITIAL_MSG).map(
  (value) => Math.random() > .5 ? new MyError() : value,
)

try {
  const unhandled = await start.unhandle(MyError).run()
  assertEquals(unhandled, INITIAL_MSG)
} catch (e) {
  assertInstanceOf(e, MyError)
}

const RECOVERY_MSG = "Smooth recovery"
const handled = await start.handle(MyError, () => Rune.constant(RECOVERY_MSG)).run()
assert(handled === INITIAL_MSG || handled === RECOVERY_MSG)

const unReHandled = await start
  .unhandle(MyError)
  .map((msg) => `**${msg}**`)
  .rehandle(MyError)
  .run()
assert(unReHandled === `**${INITIAL_MSG}**` || unReHandled instanceof MyError)

const unReHandledWithFallback = await start
  .unhandle(MyError)
  .rehandle(MyError, () => Rune.constant(RECOVERY_MSG))
  .run()
assert(unReHandledWithFallback === `**${INITIAL_MSG}**` || unReHandledWithFallback === RECOVERY_MSG)
