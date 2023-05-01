import { hex } from "../crypto/mod.ts"
import { WsConnection } from "../rpc/mod.ts"
import { ConnectionV0 } from "../server/mod.ts"
import { withSignal } from "../util/mod.ts"
import { SpawnDevNetResult } from "./common/spawnDevNet.ts"

export abstract class Net {
  abstract connection(name: string): ConnectionV0 | undefined
  abstract metadata(signal: AbortSignal, devnetTempDir: string): Promise<Uint8Array>
  spawn?: (signal: AbortSignal, devnetTempDir: string) => Promise<SpawnDevNetResult>
}

export function getMetadataFromWsUrl(url: string) {
  return withSignal(async (signal) => {
    const connection = WsConnection.connect(url, signal)
    const response = await connection.call("state_getMetadata", [])
    if (response.error) throw new Error("Error getting metadata")
    return hex.decode(response.result as string)
  })
}
