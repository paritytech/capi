import { ConnectionSpec } from "../../nets/mod.ts"
import { Connect, WsConnection } from "../../rpc/mod.ts"
import { DevnetConnection } from "./DevnetConnection.ts"

export function detectConnect(
  defaultConnectionSpec: ConnectionSpec,
  targets: Record<string, ConnectionSpec>,
): Connect {
  let connectionSpec = defaultConnectionSpec
  const targetName = Deno.env.get("CAPI_TARGET")
  if (targetName) {
    const target = targets[targetName]
    if (target) connectionSpec = target
  }
  switch (connectionSpec.type) {
    case "WsConnection":
      return WsConnection.bind(connectionSpec.discovery)
    case "DevnetConnection":
      return DevnetConnection.bind(connectionSpec.discovery)
  }
}
