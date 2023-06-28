import { spiritnet } from "@capi/spiritnet"
import { $, is } from "capi"

const { owner } = await spiritnet.Web3Names.Owner.value(
  new TextEncoder().encode("ingo"),
)
  .unhandle(is(undefined)).run()

const { authenticationKey, publicKeys } = await spiritnet.Did.Did.value(owner)
  .unhandle(is(undefined)).run()

const value = [...publicKeys.entries()].find(([k, _v]) => bytesEqual(k, authenticationKey))

console.log("DID:", value![1].key.value)
$.assert($.uint8Array, value![1].key.value.value)

function bytesEqual(a: Uint8Array, b: Uint8Array) {
  return a.every((x, i) => b[i] === x)
}
