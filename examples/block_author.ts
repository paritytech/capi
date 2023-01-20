import * as C from "http://localhost:5646/@local/mod.ts"
import {
  Session,
  System,
} from "http://localhost:5646/@local/proxy/wss:rpc.polkadot.io/pallets/mod.ts"
import { $preDigest } from "http://localhost:5646/@local/proxy/wss:rpc.polkadot.io/types/sp_consensus_babe/digests.ts"
import {
  $digestItem,
  DigestItem,
} from "http://localhost:5646/@local/proxy/wss:rpc.polkadot.io/types/sp_runtime/generic/digest.ts"
import * as U from "http://localhost:5646/@local/util/mod.ts"

const blockHeader = C.chain.getHeader(C.polkadot)()
const header = U.throwIfError(await blockHeader.run())
const digestLogs = header.digest.logs.map((x) => $digestItem.decode(C.hex.decode(x)))

function isPreRuntime(digestItem: DigestItem): digestItem is DigestItem.PreRuntime {
  return digestItem.type === "PreRuntime"
}

const digest = digestLogs.find(isPreRuntime)
if (!digest) {
  throw new Error("Missing PreRuntime log")
}

const consensusEngineId = new TextDecoder().decode(digest.value[0])

if (consensusEngineId !== "BABE") {
  throw new Error(`Unsupported consensus engine id: ${consensusEngineId}. Only BABE is supported.`)
}

const preDigest = $preDigest.decode(digest.value[1])
const validators = U.throwIfError(await Session.Validators.entry().read().run())
const pubKey = validators.value[preDigest.value.authorityIndex]!

const ss58EncodedPubKey = U.ss58.encode(
  System.SS58Prefix,
  pubKey,
)

console.log(ss58EncodedPubKey)
