/**
 * @title Read Kilt first owner DID public key details
 * @description Read first owner decentralized identity.
 * Then use the owner authentication key to get the DID public key details.
 */

import { $didPublicKeyDetails, spiritnet } from "@capi/spiritnet"
import { $, is, ValueRune } from "capi"

const owner = spiritnet.Web3Names.Owner
  .entries({ limit: 1 })
  .into(ValueRune)
  .access(0, 1, "owner")

const details = await spiritnet.Did.Did
  .value(owner)
  .unhandle(is(undefined))
  .map(({ authenticationKey, publicKeys }) => publicKeys.get(authenticationKey))
  .run()

console.log("DID public key details:", details)
$.assert($didPublicKeyDetails, details)
