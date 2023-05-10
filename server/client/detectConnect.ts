import { ConnectionSpec } from "../../nets/mod.ts"
import { Connect, WsConnection } from "../../rpc/mod.ts"
import { DevnetConnection } from "./DevnetConnection.ts"

export function detectConnect(
  spec: ConnectionSpec,
  targets: Record<string, ConnectionSpec>,
): Connect {
  const targetName = Deno.env.get("CAPI_TARGET")
  if (targetName) {
    const target = targets[targetName]
    if (target) spec = target
  }
  switch (spec.type) {
    case "DevnetConnection":
      return DevnetConnection.bind(spec.discovery)
    case "WsConnection":
      return WsConnection.bind(spec.discovery)
  }
}
