/**
 * @title Read Polkadot Identities of Fellowship Members
 * @description Read the collectives chain fellowship member public keys.
 * Then use those keys to read their identities on Polkadot.
 */

import { collectives } from "@capi/collectives"
import { $registration, polkadot } from "@capi/polkadot"
import { $, ArrayRune } from "capi"

/// Reference the total number of members.
const limit = collectives.FellowshipCollective.MemberCount.value(0)

/// Reference the `Members` map keys.
const members = collectives.FellowshipCollective.Members.keys({ limit })

/// For each member, retrieve the associated `Registration` (or `undefined`)
/// from Polkadot's Identity pallet storage.
const memberIdentities = await members
  .into(ArrayRune)
  .mapArray((member) => polkadot.Identity.IdentityOf.value(member))
  .run()

/// Ensure the result is as expected.
console.log(memberIdentities)
$.assert($.array($.option($registration)), memberIdentities)
