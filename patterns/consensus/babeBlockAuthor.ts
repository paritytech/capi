import { $preDigest } from "polkadot_dev/types/sp_consensus_babe/digests.ts"
import { Chain, ChainRune } from "../../fluent/mod.ts"
import { PublicKeyRune } from "../../fluent/mod.ts"
import { Rune, RunicArgs, ValueRune } from "../../rune/mod.ts"
import { preRuntimeDigest } from "./preRuntimeDigest.ts"

export function babeBlockAuthor<U, C extends Chain, X>(
  chain: ChainRune<U, C>,
  ...[blockHash]: RunicArgs<X, [blockHash: string]>
) {
  const validators = chain
    .metadata()
    .pallet("Session")
    .storage("Validators")
    .entry([], blockHash)
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
    .into(PublicKeyRune)
    .address(chain)
}

export class AuthorRetrievalNotSupportedError extends Error {
  override readonly name = "AuthorRetrievalNotSupportedError"
}
