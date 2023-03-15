import { $digestItem, DigestItem } from "polkadot/types/sp_runtime/generic/digest.js"
import { hex } from "../../crypto/mod.ts"
import { Chain, ChainRune } from "../../fluent/mod.ts"
import { RunicArgs, ValueRune } from "../../rune/mod.ts"

export function preRuntimeDigest<C extends Chain, U, X>(
  chain: ChainRune<C, U>,
  ...[blockHash]: RunicArgs<X, [blockHash: string]>
) {
  return chain
    .block(blockHash)
    .header()
    .into(ValueRune)
    .access("digest", "logs")
    .map((logs) =>
      logs
        .map((log) => $digestItem.decode(hex.decode(log)))
        .find((digestItem): digestItem is DigestItem.PreRuntime => digestItem.type === "PreRuntime")
        ?? new CouldNotRetrievePreRuntimeDigestError()
    )
    .unhandle(CouldNotRetrievePreRuntimeDigestError)
    .map(({ value: [typeEncoded, value] }) => ({
      type: new TextDecoder().decode(typeEncoded),
      value,
    }))
}

export class CouldNotRetrievePreRuntimeDigestError extends Error {
  override readonly name = "CouldNotRetrievePreRuntimeDigestItemError"
}
