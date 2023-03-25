import { Polkadot } from "polkadot/mod.js"
import { $preDigest } from "polkadot/types/sp_consensus_babe/digests.js"
import { Chain, ChainRune, PublicKeyRune, Rune, RunicArgs, ValueRune } from "../../mod.ts"
import { preRuntimeDigest } from "./preRuntimeDigest.ts"

export type BabeBlockAuthorChain<C extends Chain> =
  // & Chain
  & Chain.PickConstant<Polkadot, "System", "SS58Prefix">
  & Chain.PickStorage<Polkadot, "Session", "Validators">

export function babeBlockAuthor<C extends Chain, U, X>(
  chain: ChainRune<BabeBlockAuthorChain<C>, U>,
  ...[blockHash]: RunicArgs<X, [blockHash: string]>
) {
  const validators = chain
    .pallet("Session")
    .storage("Validators")
    .value(undefined, blockHash)
    .into(ValueRune)
    .unhandle(undefined)
  const authorityIndex = preRuntimeDigest(chain, blockHash)
    .map(({ type, value }) =>
      type !== "BABE"
        ? new AuthorRetrievalNotSupportedError()
        : $preDigest.decode(value)
    )
    .unhandle(AuthorRetrievalNotSupportedError)
    .access("value", "authorityIndex")
  return Rune
    .tuple([validators, authorityIndex])
    // TODO: swap this out upon Rune-compatible ValueRune.access
    .map(([validators, authorityIndex]) => validators[authorityIndex])
    .unhandle(undefined)
    .into(PublicKeyRune)
    .ss58(chain)
}

export class AuthorRetrievalNotSupportedError extends Error {
  override readonly name = "AuthorRetrievalNotSupportedError"
}
