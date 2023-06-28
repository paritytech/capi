/**
 * @title Read Kilt first owner DID public key details
 */

import { $didPublicKeyDetails, spiritnet } from "@capi/spiritnet"
import { $, is, ValueRune } from "capi"
import { equals } from "../../deps/std/bytes.ts"

const owner = spiritnet.Web3Names.Owner
  .entries({ limit: 1 })
  .into(ValueRune)
  .access(0, 1, "owner")

const [_, didPublicKeyDetails] = await spiritnet.Did.Did
  .value(owner)
  .unhandle(is(undefined))
  .map(({ authenticationKey, publicKeys }) =>
    [...publicKeys.entries()].find(([k, _v]) => equals(k, authenticationKey))
  )
  .unhandle(is(undefined))
  .run()

console.log("DID public key details:", didPublicKeyDetails)
$.assert($didPublicKeyDetails, didPublicKeyDetails)
