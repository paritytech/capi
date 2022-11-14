import { $, C, client } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as types from "../types/mod.ts"

/**
 *  Assignment keys for the current session.
 *  Note that this API is private due to it being prone to 'off-by-one' at session boundaries.
 *  When in doubt, use `Sessions` API instead.
 */
export const AssignmentKeysUnsafe = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "ParaSessionInfo",
  "AssignmentKeysUnsafe",
  $.tuple(),
  _codec.$695,
)

/** The earliest session for which previous session info is stored. */
export const EarliestStoredSession = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "ParaSessionInfo",
  "EarliestStoredSession",
  $.tuple(),
  _codec.$4,
)

/**
 *  Session information in a rolling window.
 *  Should have an entry in range `EarliestStoredSession..=CurrentSessionIndex`.
 *  Does not have any entries before the session index in the first session change notification.
 */
export const Sessions = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "ParaSessionInfo",
  "Sessions",
  $.tuple(_codec.$4),
  _codec.$696,
)

/** The validator account keys of the validators actively participating in parachain consensus. */
export const AccountKeys = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "ParaSessionInfo",
  "AccountKeys",
  $.tuple(_codec.$4),
  _codec.$206,
)
