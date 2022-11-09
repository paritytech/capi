import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

/** The validator account keys of the validators actively participating in parachain consensus. */
export const AccountKeys = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Identity"],
  key: $.tuple(_codec.$4),
  value: _codec.$206,
}

/**
 *  Assignment keys for the current session.
 *  Note that this API is private due to it being prone to 'off-by-one' at session boundaries.
 *  When in doubt, use `Sessions` API instead.
 */
export const AssignmentKeysUnsafe = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$695,
}

/** The earliest session for which previous session info is stored. */
export const EarliestStoredSession = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/**
 *  Session information in a rolling window.
 *  Should have an entry in range `EarliestStoredSession..=CurrentSessionIndex`.
 *  Does not have any entries before the session index in the first session change notification.
 */
export const Sessions = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Identity"],
  key: $.tuple(_codec.$4),
  value: _codec.$696,
}
