import { $digestItem, DigestItem } from "@capi/polkadot"
import { Chain, ChainRune, hex, is, RunicArgs, ValueRune } from "../../../mod.ts"

export function preRuntimeDigest<C extends Chain, U, X>(
  chain: ChainRune<C, U>,
  ...[blockHash]: RunicArgs<X, [blockHash: string]>
) {
  return chain
    .blockHash(blockHash)
    .block()
    .header()
    .into(ValueRune)
    .access("digest", "logs")
    .map((logs) =>
      logs
        .map((log) => $digestItem.decode(hex.decode(log)))
        .find((digestItem): digestItem is DigestItem.PreRuntime => digestItem.type === "PreRuntime")
        ?? new CouldNotRetrievePreRuntimeDigestError()
    )
    .unhandle(is(CouldNotRetrievePreRuntimeDigestError))
    .map(({ value: [typeEncoded, value] }) => ({
      type: new TextDecoder().decode(typeEncoded),
      value,
    }))
}

export class CouldNotRetrievePreRuntimeDigestError extends Error {
  override readonly name = "CouldNotRetrievePreRuntimeDigestItemError"
}
