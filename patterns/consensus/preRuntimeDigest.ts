import { $digestItem, DigestItem } from "polkadot_dev/types/sp_runtime/generic/digest.ts"
import { Chain, ChainRune } from "../../fluent/mod.ts"
import { RunicArgs, ValueRune } from "../../rune/mod.ts"
import { HexHash } from "../../util/branded.ts"
import { hex } from "../../util/mod.ts"

export function preRuntimeDigest<U, C extends Chain, X>(
  chain: ChainRune<U, C>,
  ...[blockHash]: RunicArgs<X, [HexHash]>
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
