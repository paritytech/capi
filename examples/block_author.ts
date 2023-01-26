import * as C from "capi/mod.ts"
import { assert } from "../deps/std/testing/asserts.ts"

import { client, Session, System, t } from "polkadot/mod.ts"

const {
  sp_consensus_babe: { digests: { $preDigest } },
  sp_runtime: { generic: { digest: { $digestItem } } },
} = t

// TODO: codegen guards?
type DigestItem = t.sp_runtime.generic.digest.DigestItem
type PreRuntime = t.sp_runtime.generic.digest.DigestItem.PreRuntime
function isPreRuntime(digestItem: DigestItem): digestItem is PreRuntime {
  return digestItem.type === "PreRuntime"
}

const header = C.throwIfError(await C.chain.getHeader(client)().run())
const digestLogs = header.digest.logs.map((log) => $digestItem.decode(C.hex.decode(log)))

const preRuntimeLog = digestLogs.find(isPreRuntime)
assert(preRuntimeLog, "Missing PreRuntime log")

const consensusEngineId = new TextDecoder().decode(preRuntimeLog.value[0])
assert(
  consensusEngineId === "BABE",
  `Unsupported consensus engine id: ${consensusEngineId}. Only BABE is supported.`,
)

const preDigest = $preDigest.decode(preRuntimeLog.value[1])
const validators = C.throwIfError(await Session.Validators.entry().read().run())
const pubKey = validators.value[preDigest.value.authorityIndex]
assert(pubKey)

const ss58EncodedPubKey = C.ss58.encode(System.SS58Prefix, pubKey)
console.log(ss58EncodedPubKey)
