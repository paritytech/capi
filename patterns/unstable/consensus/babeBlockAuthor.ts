import { $preDigest } from "@capi/polkadot"
import {
  AccountIdRune,
  AddressPrefixChain,
  ChainRune,
  is,
  Rune,
  RunicArgs,
  ValueRune,
} from "../../../mod.ts"
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
    .unhandle(is(undefined))
  const authorityIndex = preRuntimeDigest(chain, blockHash)
    .map(({ type, value }) => {
      if (type !== "BABE") return new AuthorRetrievalNotSupportedError()
      return $preDigest.decode(value)
    })
    .unhandle(is(AuthorRetrievalNotSupportedError))
    .access("value", "authorityIndex")
  return Rune
    .tuple([validators, authorityIndex])
    // TODO: swap this out upon Rune-compatible ValueRune.access
    .map(([validators, authorityIndex]) => validators[authorityIndex])
    .unhandle(is(undefined))
    .into(AccountIdRune)
    .ss58(chain)
}

export class AuthorRetrievalNotSupportedError extends Error {
  override readonly name = "AuthorRetrievalNotSupportedError"
}
