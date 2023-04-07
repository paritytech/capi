import { $preDigest } from "@capi/polkadot/types/sp_consensus_babe/digests.js"
import { AddressPrefixChain, ChainRune } from "../../fluent/mod.ts"
import { AccountIdRune } from "../../fluent/mod.ts"
import { Rune, RunicArgs, ValueRune } from "../../rune/mod.ts"
import { preRuntimeDigest } from "./preRuntimeDigest.ts"

export function babeBlockAuthor<C extends AddressPrefixChain, U, X>(
  chain: ChainRune<C, U>,
  ...[blockHash]: RunicArgs<X, [blockHash: string]>
) {
  const validators = chain
    .pallet("Session")
    .storage("Validators")
    .value(undefined!, blockHash)
    .unsafeAs<Uint8Array[] | undefined>()
    .into(ValueRune)
    .unhandle(undefined)
  const authorityIndex = preRuntimeDigest(chain, blockHash)
    .map(({ type, value }) => {
      if (type !== "BABE") return new AuthorRetrievalNotSupportedError()
      return $preDigest.decode(value)
    })
    .unhandle(AuthorRetrievalNotSupportedError)
    .access("value", "authorityIndex")
  return Rune
    .tuple([validators, authorityIndex])
    // TODO: swap this out upon Rune-compatible ValueRune.access
    .map(([validators, authorityIndex]) => validators[authorityIndex])
    .unhandle(undefined)
    .into(AccountIdRune)
    .ss58(chain)
}

export class AuthorRetrievalNotSupportedError extends Error {
  override readonly name = "AuthorRetrievalNotSupportedError"
}
