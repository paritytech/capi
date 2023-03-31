/**
 * @title Reserve an Index
 * @stability experiment – it's unclear how useful the identity info transcoding
 * is (or the identity pallet for that matter). We may decide we do not wish to
 * maintain this utility. For now however, it's a good way to stress-test Rune.
 *
 * Set a user's identity, potentially with metadata of arbitrary user-defined shape.
 */

import { $ } from "capi"
import { IdentityInfoTranscoders } from "capi/patterns/identity.ts"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { createUsers, Identity } from "polkadot_dev/mod.js"

const { alexa } = await createUsers()

// Initialize an `IdentityInfoTranscoders` of shape `{ stars: number }`.
const transcoders = new IdentityInfoTranscoders({ stars: $.u8 })

// Encode some identity info into the expected shape and use it
// to execute the identity-setting transaction.
await Identity
  .setIdentity({
    info: transcoders.encode({
      display: "Chev Chelios",
      additional: { stars: 5 },
    }),
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus()
  .finalized()
  .run()

// Retrieve and decode the identity info.
const infoDecoded = await Identity.IdentityOf
  .value(alexa.publicKey)
  .unhandle(undefined)
  .access("info")
  .pipe((raw) => transcoders.decode(raw))
  .run()

$.assert($.u8, infoDecoded.additional.stars)
