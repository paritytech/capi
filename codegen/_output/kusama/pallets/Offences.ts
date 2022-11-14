import { $, C, client } from "../capi.ts"
import * as _codec from "../codecs.ts"

/** A vector of reports of the same kind that happened at the same time slot. */
export const ConcurrentReportsIndex = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Offences",
  "ConcurrentReportsIndex",
  _codec.$510,
  _codec.$157,
)

/** The primary structure that holds all offence records keyed by report identifiers. */
export const Reports = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Offences",
  "Reports",
  $.tuple(_codec.$11),
  _codec.$509,
)

/**
 *  Enumerates all reports of a kind along with the time they happened.
 *
 *  All reports are sorted by the time of offence.
 *
 *  Note that the actual type of this mapping is `Vec<u8>`, this is because values of
 *  different types are not supported at the moment so we are doing the manual serialization.
 */
export const ReportsByKindIndex = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Offences",
  "ReportsByKindIndex",
  $.tuple(_codec.$45),
  _codec.$12,
)
