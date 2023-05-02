import { hex } from "../crypto/mod.ts"
import * as $ from "../deps/scale.ts"
import { WsConnection } from "../rpc/mod.ts"
import { withSignal } from "../util/mod.ts"

export abstract class NetSpec {
  name!: string // set by `resolveNets.ts`

  abstract connection(name: string): ConnectionSpec | undefined
  abstract metadata(signal: AbortSignal, tempDir: string): Promise<Uint8Array>
}

export function getMetadataFromWsUrl(url: string) {
  return withSignal(async (signal) => {
    const connection = WsConnection.connect(url, signal)
    const response = await connection.call("state_getMetadata", [])
    if (response.error) throw new Error("Error getting metadata")
    return hex.decode(response.result as string)
  })
}

export type ConnectionSpec = $.Native<typeof $connectionSpec>
export const $connectionSpec = $.taggedUnion("type", [
  $.variant("WsConnection", $.field("discovery", $.str)),
  $.variant("DevnetConnection", $.field("discovery", $.str)),
])
