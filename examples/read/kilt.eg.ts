/**
 * @title Read Kilt first owner DID public key details
 */

import { $didPublicKeyDetails, spiritnet } from "@capi/spiritnet"
import { $, is, ValueRune } from "capi"

const owner = spiritnet.Web3Names.Owner
  .entries({ limit: 1 })
  .into(ValueRune)
  .access(0, 1, "owner")

const didPublicKeyDetails = await spiritnet.Did.Did
  .value(owner)
  .unhandle(is(undefined))
  .map(({ authenticationKey, publicKeys }) => publicKeys.get(authenticationKey))
  .unhandle(is(undefined))
  .run()

console.log("DID public key details:", didPublicKeyDetails)
$.assert($didPublicKeyDetails, didPublicKeyDetails)
