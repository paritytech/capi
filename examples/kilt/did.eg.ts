import { spiritnet } from "@capi/spiritnet"
import { $, is } from "capi"
import { equals } from "../../deps/std/bytes.ts"

const { owner } = await spiritnet.Web3Names.Owner.value(
  new TextEncoder().encode("ingo"),
)
  .unhandle(is(undefined)).run()

const { authenticationKey, publicKeys } = await spiritnet.Did.Did.value(owner)
  .unhandle(is(undefined)).run()

const value = [...publicKeys.entries()].find(([k, _v]) => equals(k, authenticationKey))

console.log("DID:", value![1].key.value)
$.assert($.uint8Array, value![1].key.value.value)
