import { $preDigest } from "polkadot_dev/types/sp_consensus_babe/digests.ts"
import { Chain, ClientRune } from "../../fluent/mod.ts"
import { PublicKeyRune } from "../../fluent/mod.ts"
import { Rune, RunicArgs, ValueRune } from "../../rune/mod.ts"
import { HexHash } from "../../util/branded.ts"
import { preRuntimeDigest } from "./preRuntimeDigest.ts"

export function babeBlockAuthor<U, C extends Chain, X>(
  client: ClientRune<U, C>,
  ...[blockHash]: RunicArgs<X, [HexHash]>
) {
  const validators = client
    .into(ClientRune)
    .metadata()
    .pallet("Session")
    .storage("Validators")
    .entry([], blockHash)
    .unsafeAs<Uint8Array[] | undefined>()
    .into(ValueRune)
    .unhandle(undefined)
  const authorityIndex = preRuntimeDigest(client, blockHash)
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
    .address(client)
}

export class AuthorRetrievalNotSupportedError extends Error {
  override readonly name = "AuthorRetrievalNotSupportedError"
}
