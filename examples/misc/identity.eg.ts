/**
 * @title Utilize The Identity Pallet With Fields
 * @description Set a user's identity, potentially with metadata of arbitrary user-defined shape.
 * @note It's unclear how useful the identity info transcoding is (or the identity pallet
 * for that matter). We may decide we do not wish to maintain this utility. For now
 * however, it's a good way to stress-test Rune.
 */

import { polkadotDev } from "@capi/polkadot-dev"
import { $, createDevUsers, is } from "capi"
import { signature } from "capi/patterns/signature/polkadot"
import { IdentityInfoTranscoders } from "capi/patterns/unstable/identity"

const { alexa } = await createDevUsers()

/// Initialize an `IdentityInfoTranscoders` of shape `{ stars: number }`.
const transcoders = new IdentityInfoTranscoders({ stars: $.u8 })

/// Encode some identity info into the expected shape and use it
/// to execute the identity-setting transaction.
await polkadotDev.Identity
  .setIdentity({
    info: transcoders.encode({
      display: "Chev Chelios",
      additional: { stars: 5 },
    }),
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Set identity:")
  .finalized()
  .run()

/// Retrieve and decode the identity info.
const infoDecoded = await polkadotDev.Identity.IdentityOf
  .value(alexa.publicKey)
  .unhandle(is(undefined))
  .access("info")
  .pipe((raw) => transcoders.decode(raw))
  .run()

console.log("identity info:", infoDecoded)
$.assert($.u8, infoDecoded.additional.stars)
