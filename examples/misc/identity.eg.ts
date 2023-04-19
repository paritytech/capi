/**
 * @title Utilize The Identity Pallet With Fields
 * @stability experiment it's unclear how useful the identity info transcoding
 * is (or the identity pallet for that matter). We may decide we do not wish to
 * maintain this utility. For now however, it's a good way to stress-test Rune.
 * @description Set a user's identity, potentially with metadata of arbitrary user-defined shape.
 */

import { Identity } from "@capi/polkadot-dev"
import { $, createDevUsers } from "capi"
import { IdentityInfoTranscoders } from "capi/patterns/identity.ts"
import { signature } from "capi/patterns/signature/polkadot.ts"

const { alexa } = await createDevUsers()

/// Initialize an `IdentityInfoTranscoders` of shape `{ stars: number }`.
const transcoders = new IdentityInfoTranscoders({ stars: $.u8 })

/// Encode some identity info into the expected shape and use it
/// to execute the identity-setting transaction.
await Identity
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
const infoDecoded = await Identity.IdentityOf
  .value(alexa.publicKey)
  .unhandle(undefined)
  .access("info")
  .pipe((raw) => transcoders.decode(raw))
  .run()

console.log("identity info:", infoDecoded)
$.assert($.u8, infoDecoded.additional.stars)
