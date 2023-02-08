import { $digestItem, DigestItem } from "polkadot_dev/types/sp_runtime/generic/digest.ts"
import { ClientRune } from "../../fluent/mod.ts"
import { Client } from "../../rpc/mod.ts"
import { RunicArgs, ValueRune } from "../../rune/mod.ts"
import { HexHash } from "../../util/branded.ts"
import { hex } from "../../util/mod.ts"

export function preRuntimeDigest<X>(...args: RunicArgs<X, [client: Client, at: HexHash]>) {
  const [client, at] = RunicArgs.resolve(args)
  return client
    .into(ClientRune)
    .block(at)
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
