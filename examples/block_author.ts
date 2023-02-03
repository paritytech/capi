import * as C from "capi/mod.ts"
import { assert } from "../deps/std/testing/asserts.ts"

import { client, Session, System } from "polkadot/mod.ts"
import { $preDigest } from "polkadot/types/sp_consensus_babe/digests.ts"
import { $digestItem, DigestItem } from "polkadot/types/sp_runtime/generic/digest.ts"

// TODO: codegen guards?
function isPreRuntime(digestItem: DigestItem): digestItem is DigestItem.PreRuntime {
  return digestItem.type === "PreRuntime"
}

const header = await C.chain.getHeader(client).run()
const digestLogs = header.digest.logs.map((log) => $digestItem.decode(C.hex.decode(log)))

const preRuntimeLog = digestLogs.find(isPreRuntime)
assert(preRuntimeLog, "Missing PreRuntime log")

const consensusEngineId = new TextDecoder().decode(preRuntimeLog.value[0])
assert(
  consensusEngineId === "BABE",
  `Unsupported consensus engine id: ${consensusEngineId}. Only BABE is supported.`,
)

const preDigest = $preDigest.decode(preRuntimeLog.value[1])
const validators = await Session.Validators.entry([]).run()
const pubKey = validators[preDigest.value.authorityIndex]
assert(pubKey)

const ss58EncodedPubKey = C.ss58.encode(System.SS58Prefix, pubKey)
console.log(ss58EncodedPubKey)
