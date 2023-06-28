/**
 * @title Kilt decentralized identifier (DID)
 * @description Get a user public key based on the web3name alias of a Kilt DID.
 */

import { $didPublicKeyDetails, spiritnet } from "@capi/spiritnet"
import { $, is } from "capi"
import { equals } from "../../deps/std/bytes.ts"

const { owner } = await spiritnet.Web3Names.Owner
  .value(new TextEncoder().encode("ingo"))
  .unhandle(is(undefined))
  .run()

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
