import { FinalizedBlockHashRune, hex, Rune, ss58, ValueRune } from "capi"
import { client, Session, System } from "polkadot/mod.ts"
import { $preDigest } from "polkadot/types/sp_consensus_babe/digests.ts"
import { $digestItem, DigestItem } from "polkadot/types/sp_runtime/generic/digest.ts"

export class AuthorRetrievalNotSupportedError extends Error {
  override readonly name = "AuthorRetrievalNotSupportedError"
}

const finalizedBlockHash = Rune
  .constant(undefined)
  .into(FinalizedBlockHashRune, client)

const preDigest = finalizedBlockHash
  .header()
  .into(ValueRune)
  .access("digest", "logs")
  .map((logs) =>
    logs
      .map((log) => $digestItem.decode(hex.decode(log)))
      .find((digestItem): digestItem is DigestItem.PreRuntime => digestItem.type === "PreRuntime")
  )
  .unhandle(undefined)
  .map(({ value: [consensusIdBytes, preDigestBytes] }) => {
    if (new TextDecoder().decode(consensusIdBytes) === "BABE") {
      return $preDigest.decode(preDigestBytes)
    }
    return new AuthorRetrievalNotSupportedError()
  })
  .unhandle(AuthorRetrievalNotSupportedError)

const result = await Session.Validators
  .entry([], finalizedBlockHash)
  .access(await preDigest.access("value", "authorityIndex").run())
  .unhandle(undefined)
  .map((pubKey) => ss58.encode(System.SS58Prefix, pubKey))
  .run()

console.log(result)
