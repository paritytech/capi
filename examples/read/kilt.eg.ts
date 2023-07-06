/**
 * @title Read Kilt public key details of first owner in web3 names owners map
 * @description Read the first entry of the Web3Names map, and access
 * the DID public key details of the owner.
 */

import { $didPublicKeyDetails, spiritnet } from "@capi/spiritnet"
import { $, is, ValueRune } from "capi"

/// Reference the `owner` field of the first entry of the the web3 names owners map.
const owner = spiritnet.Web3Names.Owner
  .entries({ limit: 1 })
  .into(ValueRune)
  .access(0, 1, "owner")

/// Retrieve the associated DID public key details.
const details = await spiritnet.Did.Did
  .value(owner)
  .unhandle(is(undefined))
  .map(({ authenticationKey, publicKeys }) => publicKeys.get(authenticationKey))
  .run()

/// Ensure `details` is of the expected shape.
console.log("DID public key details:", details)
$.assert($didPublicKeyDetails, details)
